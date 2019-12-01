# kks Kunkunshi interchange format (DRAFT)

## File format (Version 1)

A `kks` file contains a single [JSON](https://www.json.org/) object.

The top level object has the following properties:

- `music`: array (required)

  An array of music event objects. All event objects have a `type` attribute
  and additional type-specific attributes.

- `title`: string (required)

  The title of the piece.

- `shaku`: string (optional)

  Whether the shaku (尺) finger position represents 5 (`low`) or 6(`high`)
  semitones above the open middle string. The default is `low`.

- `tempo`: number (optional)

  The tempo of the piece in beats per minute. The default is 100.

- `tuning`: string (optional)

  A mnemonic representing the tuning. The default is `h` or honchōshi.

  | Mnemonic | Name   | Transliteration |
  |----------|--------|-----------------|
  | `h`      | 本調子 | honchōshi       |
  | `2a`     | 二揚げ | niage           |
  | `3s`     | 三下げ | sansage         |

- `version`: number (required)

  This must be `1`.

An application consuming a `kks` file must ignore any unrecognised properties.

## `note` event

Properties:

- `type`: `"note"`

- `duration`: number (required)

  This is the duration of the note as a fraction. In practice, this will be
  either `1` or `0.5`.

- `position`: string (required)

  The left-hand position for this note.
  This is a short one- to three-character code as described in the
  separate [mnemonics](mnemonics.md) documentation.

- `articulation`: string (optional)

  This can be either `hammer` or `upstroke`.

## `jump` event

Jump back to the identically-labelled mark (i.e. an upward-pointing arrow in
kunkunshi). The same identifier can be used for multiple jumps but must
refer to an existing earlier `mark`.

Properties:

- `type`: `"jump"`

- `identifier`: string (required)

## `mark` event

Mark this event to jump back to (i.e. a downward-pointing arrow in kunkunshi).
This identifier must be unique and there must be at least one corresponding
`jump`.

Properties:

- `type`: `"mark"`

- `identifier`: string (required)

## `chord` event

This is similar to the `note` event, but is used when two or three strings are
to be played simultaneously.

Properties:

- `type`: `"chord"`

- `duration`: number (required)

  As `note` above.

- `notes`: array (required)

  An array of objects representing the positions to be played.
  They may be listed in any order.
  These objects are similar to `note` events, but have only two properties:

  - `type`: `"note"`
  - `position`: string (required)

- `articulation`: string (optional)

  As `note` above.
