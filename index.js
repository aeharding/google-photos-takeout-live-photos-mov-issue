const FileType = require('file-type')
const { glob } = require('glob')
const fs = require('fs')
const cliProgress = require('cli-progress')
const path = require('path')
const ora = require('ora')
const { rejects } = require('assert')
const Confirm = require('prompt-confirm')

const BASE = '/Volumes/home/Drive/Moments'
// const BASE = `${process.env.HOME}/Documents/pics/2020-12-01-17h05/Takeout/Google Photos`
const globMatchStr = `${BASE}/**/*(1).{HEIC,JPG}`

;(async () => {
  const spinner = ora(`Finding ${globMatchStr}`).start()

  const paths = await new Promise((resolve, reject) => {
    glob(globMatchStr, { noext: true }, (err, res) => {
      if (err) return rejects(err)

      resolve(res)
    })
  })

  spinner.succeed(`Found ${paths.length} potentials, continuing...`)

  const progress = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  )

  progress.start(paths.length, 0)

  for (const [index, filePath] of paths.entries()) {
    progress.update(index)

    const { ext: mimeExt } = await FileType.fromFile(filePath)
    const ext = path.extname(filePath).slice(1).toLowerCase()

    if (mimeExt !== 'mov' || ext === mimeExt) {
      //   console.log('mime type is fine (not mov), skipping...')
      continue // Doesn't match mime type!
    }

    const filename = path.basename(filePath)
    const targetImgFilename = filename.replace(
      `(1)${path.extname(filePath)}`,
      path.extname(filePath)
    )
    const targetImgPath = filePath.replace(filename, targetImgFilename)

    if (!fs.existsSync(targetImgPath)) {
      //   console.log(
      //     'Looks like legitimate (1), not Google Photos (1), skipping...'
      //   )
      continue
    }

    const targetMovFilename = targetImgFilename.replace(
      path.extname(filePath),
      '.MOV'
    )
    const targetMovPath = filePath.replace(filename, targetMovFilename)

    // The path already exists where we want to rename. Don't clobber
    if (fs.existsSync(targetMovPath)) {
      //   console.log('File we want to rename to exists, skipping...')
      continue
    }

    // Comment out this code block to auto apply
    /////////////////////////////////////////
    progress.stop()
    try {
      await new Confirm(
        `Found file:\n        ${filePath}\nWith mimetype of:\n        ${mimeExt}\nConfirm rename to\n        ${targetMovPath}\n`
      ).run()
    } finally {
      progress.start(paths.length, index)
    }
    /////////////////////////////////////////

    // Do the rename!
    fs.renameSync(filePath, targetMovPath)
  }

  progress.stop()
})()

//=> {ext: 'png', mime: 'image/png'}
