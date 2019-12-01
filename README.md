# Kunkunshi

This is a collection of tools for transcribing and publishing Okinawan
[sanshin](https://en.wikipedia.org/wiki/Sanshin) music in
[kunkunshi](https://en.wikipedia.org/wiki/Kunkunshi) notation.

# aor: Transcription language

This is a terse text-based system for transcribing kunkunshi, requiring only
ASCII and minimal typing. [Specification](doc/aor.md).

A JavaScript PEG parser implementation is included.

# kks: Kunkunshi interchange format

This will be used as the internal model for these tools and for
interoperability with other software. [Specification](doc/kks.md).

# Tools

## Prerequisites

- [Node.js](https://nodejs.org/) JavaScript runtime
- [Yarn](https://yarnpkg.com/) package manager

Run `yarn install` to install libraries required.

## `aor2kks.js`

This converts a file in [aor](doc/aor.md) format to [kks](doc/kks.md)
format.

## `kks2ly.js`

This converts a file in [kks](doc/kks.md) format to
[LilyPond](http://lilypond.org/) source code. It uses `kunkunshi.ly` to render
the music as a dual Western and kunkunshi tablature format.

## `music/kunkunshi.ly`

An implementation of a hybrid kunkunshi notation that is compatible with
the Western musical stave. It uses the position kanji from kunkunshi but
places them on a three-line horizontal tablature stave.
