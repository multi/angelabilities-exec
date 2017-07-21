module.exports = function (angel) {
  var exec = require('child_process').exec

  angel.sh = function (command, next) {
    var cwd = process.cwd()
    var child = exec(command, {
      cwd: cwd,
      maxBuffer: process.env.NODE_EXEC_MAX_BUFFER || 5 * 1024 * 1024,
      env: Object.assign({}, process.env, {
        FORCE_COLOR: true,
      })
    })
    child.stderr.pipe(process.stderr)
    child.stdout.pipe(process.stdout)
    child.on('exit', function (code) {
      if (code !== 0) {
        var err = new Error([
          'failed',
          command,
          'on',
          cwd
        ].join(' '))

        if (next) {
          return next(err)
        }

        console.error(err)
      }

      if (next) {
        next()
      }
    })

    return child
  }
}
