# aor (合乙老)

This is a minimal notation system for transcribing Okinawan
[kunkunshi](https://en.wikipedia.org/wiki/Kunkunshi) notation for the
[sanshin](https://en.wikipedia.org/wiki/Sanshin), and a JavaScript
implementation of a PEG-based parser for the notation.

It is based loosely on [abc notation](http://abcnotation.com/) and uses
mnemonics for the notes to avoid the inconvenience of dealing with input
method conversions. As with kunkunshi, it represents positions on the
neck rather than abstract pitches; the pitch represented by any given
mnemonic depends on the tuning in use.

## Syntax

A file consists of one or more lines of metadata, a blank line, and one or more
musical expressions, e.g.:

    Title: てぃんさぐぬ花
    Tuning: 3s

    -> t t/ 5/ k/ t/' z 4 a/ r/' 4 5 t t/ 5/ k/ t/' z
    4 a/ r/' <- t t/ 5/ k/ t/' z 4 a/ r/' 4 5
    t t/ 5/ 7 a 8 a 7 8 t t/ 5/ k/ t/' z
    4 a/ r/' 4 5 t t/ 5/ k/ t/' z 4 a/ r/' 4 5 <-

### Metadata

Metadata entries are in the form `key: value`, one entry per line.
In principle, any information can be added as metadata, provided that:

- Each key is unique
- The value can fit on one line

Some metadata is defined with a special meaning:

#### Title

The title of the piece.

#### Tuning

The following tunings are defined:

| Mnemonic | Name   | Transliteration |
|----------|--------|-----------------|
| `h`      | 本調子 | honchōshi       |
| `2a`     | 二揚げ | niage           |
| `3s`     | 三下げ | sansage         |

If not specified, honchōshi is assumed.

#### Shaku

There are two potential finger positions for 尺 depending on the piece: 5
semitones above the open string for the "low" shaku, or six semitones for the
"high" shaku. This field can thus be `high` or `low`. If not specified,
`low` is assumed.

### Positions

Note mnemonics use four principles:

1. For numbered positions (四, 五, etc.), use the corresponding number.
2. For other kanji, use the first letter of the
   [Kunrei-shiki](https://en.wikipedia.org/wiki/Kunrei-shiki_romanization\))
   romanisation.
3. For positions prefixed with 亻 (e.g. 亿), prefix a `n` for "ninben").
4. For positions prefixed with 下 (e.g. 下尺), prefix a `g` for "ge".

The positions are thus:

| Kunkunshi | Mnemonic |
|-----------|----------|
| 合        | a        |
| 乙        | o        |
| 老        | r        |
| 下老      | gr       |
| 四        | 4        |
| 上        | z        |
| 中        | t        |
| 尺        | s        |
| 下尺      | gs       |
| 工        | k        |
| 五        | 5        |
| 六        | 6        |
| 七        | 7        |
| 八        | 8        |
| 九        | 9        |
| 佮        | na       |
| 亿        | no       |
| 佬        | nr       |
| 下佬      | gnr      |
| 伵        | n4       |
| 仩        | nz       |
| 仲        | nt       |
| 伬        | ns       |
| 下伬      | gns      |
| 仜        | nk       |
| 伍        | n5       |
| 𠆾        | n6       |
| ⿰亻七    | n7       |
| 仈        | n8       |
| 仇        | n9       |

### Articulations

#### Upstroke

An upstroke is notated by appending `^` to the note, after the length (if
present):

    r1/2^

#### Hammer-on

A hammer-on is notated by appending `'` (a single quote) to the note, after
the length (if present):

    t1/2'

### Lengths

The notation assumes a basic note length, as represented by a single grid cell
in kunkunshi.

Lengths are in principle notated as fractions of this, so `a1/2` represents
合 for half the basic note length.

For convenience, the numerator can be omitted, so `a/4` is the same as `a1/4`.
As a further convenience, the denominator is assumed to be 2, so `a/` is the
same as `a1/2`.

Other note lengths can in principle be notated as `a3/2` etc., although these
do not commonly turn up in kunkunshi.

### Repetition

Repetitions are notated by to and from arrows. A right-pointing arrow assigns
a mark; a left-pointing arrow assigns a jump to a preceding marker.

#### Mark

This is notated to the left of the note to which it refers, i.e. `a -> o r`
applies to the `o`.

#### Jump

This is notated to the right of the note, i.e. `a o <- r` will jump back after
the `o`.

#### Multiple repetitions

Repetitions can be labelled `A>` to `Z>`, or notated as `->` for the default
`A` when there is only one.

- `->` Mark A
- `A>` Mark A
- `<B` Jump back to B
