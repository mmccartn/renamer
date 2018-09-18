#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser
const fs = require('fs')
const path = require('path')

const dashSpace = function(name) {
    return name.replace(/([a-z])-([a-z])/i, '$1 - $2')
}

const flacParen = function(name) {
    return name.replace(/\(FLAC\)|\(FLAC-EAC\)/i, '()')
}

const main = function(args) {
    const targetPath = args.absPath ? args.path : path.join(__dirname, args.path)
    const opts = { withFileTypes : true }
    const targets = fs.readdirSync(targetPath, opts)
        .filter(item => item.isDirectory())
        .map(item => item.name)
        .map(name => dashSpace(name))
        .map(name => flacParen(name))
    console.log(targets)
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
