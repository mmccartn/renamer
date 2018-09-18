#!/usr/bin/env node

const ArgumentParser = require('argparse').ArgumentParser
const fs = require('fs')
const path = require('path')
const readlineSync = require('readline-sync')

const dashSpace = function(name) {
    return name.replace(/([a-z])-([a-z])/i, '$1 - $2')
}

const flacParen = function(name) {
    return name.replace(/\(FLAC\)|\(FLAC-EAC\)/i, '()')
}

const main = function(args) {
    const targetPath = args.absPath ? args.path : path.join(__dirname, args.path)
    const opts = { withFileTypes: true }
    const targets = fs.readdirSync(targetPath, opts)
        .filter(item => item.isDirectory())
        .map(item => Object.assign(item, { newName: item.name }))
        .map(item => Object.assign(item, { newName: dashSpace(item.newName) }))
        .map(item => Object.assign(item, { newName: flacParen(item.newName) }))
    console.info(targets.map(item => item.newName))
    let count = 0
    if (readlineSync.keyInYN('Apply new names?')) {
        targets.forEach(item => {
            fs.renameSync(
                path.join(targetPath, item.name),
                path.join(targetPath, item.newName)
            )
            count++
        })
    }
    console.info('Renamed', count)
}

if (require.main === module) {
    const parser = new ArgumentParser({
        version: '1.0.0',
        addHelp: true,
        description: 'Rename utility'
    })
    parser.addArgument(
        ['-p', '--path'], {
            help: 'Path to directory containing items to rename'
        }
    )
    const args = parser.parseArgs()
    args.absPath = true
    main(args)
}
