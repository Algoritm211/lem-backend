const { customAlphabet } = require('nanoid')
const { spawn } = require('child_process')
const fs = require('fs')
const consola = require('consola')

const promiseFromChildProcess = (child) => {
  return new Promise((resolve, reject) => {
    child.stdout.on('data', resolve)
    child.stderr.on('error', reject)
    // eslint-disable-next-line prefer-promise-reject-errors
    child.on('close', () => reject('EXEC ERROR'))
  })
}


class CodeService {
  constructor() {
    this.dirNameExec = __dirname
    this.nanoid = customAlphabet('1234567890abcdef', 10)
  }

  async runCodeWithTests({
    code,
    rawTests,
    fileExt,
    logWrapper,
    commandForRun,
  }) {
    let codeValid = true
    const fileName = `${this.nanoid()}.${fileExt}`
    const tests = logWrapper(rawTests)
    const content = `${code}\n\n${tests}`
    this.makeFile(fileName, content)
    try {
      const child = spawn(commandForRun, [fileName], { cwd: this.dirNameExec, timeout: 1200 })
      const runDataRaw = await promiseFromChildProcess(child)
      const resultsFromBuff = fileExt === 'js' ?
        Buffer.from(runDataRaw).toString().split(' ').map((elem) => elem.replace('\n', '')) :
        Buffer.from(runDataRaw).toString().split('\n').slice(0, -1)

      resultsFromBuff.forEach((num, index) => {
        if (rawTests[index]?.expected !== num) {
          codeValid = false
        }
      })
      return codeValid
    } catch (error) {
      throw new Error(error)
    } finally {
      fs.rmSync(`${this.dirNameExec}/${fileName}`)
    }
  }

  runPyCode(code, rawTests) {
    return this.runCodeWithTests({
      code,
      rawTests,
      fileExt: 'py',
      logWrapper: (tests) => tests
        .map((testObj) => `print(${testObj.test})\n`)
        .join(''),
      commandForRun: 'python3',
    })
  }

  runJSCode(code, rawTests) {
    return this.runCodeWithTests({
      code,
      rawTests,
      fileExt: 'js',
      logWrapper: (tests) => `console.log(${tests.map((testObj) => testObj.test).join(', ')})`,
      commandForRun: 'node',
    })
  }

  makeFile(fileName, content) {
    try {
      fs.writeFileSync(`${this.dirNameExec}/${fileName}`, content)
    } catch (error) {
      consola.error('Error while creating file')
    }
  }
}

module.exports = new CodeService()
