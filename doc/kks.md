# kks Kunkunshi interchange format

## File format (Version 1)

A `kks` file contains a single [JSON](https://www.json.org/) object containing
attributes described below.

An application consuming a `kks` file must ignore any unrecognised attributes.

## `music`:array (required)

An array of music event objects. All event objects have a `type` attribute
and additional type-specific attributes.

### `articulation`:string (optional for note)

This can be either `hammer` or `upstroke`.

### `duration`:number (required for note and rest)

This is the duration of the note as a fraction. In practice, this will be
either `1` or `0.5`.

### `jump`:string (optional)

Jump back to the identically-named mark (i.e. an upward-pointing arrow in
kunkunshi). The same identifier can be used for multiple jumps but must
refer to an existing earlier `mark`.

### `mark`:string (optional)

Mark this event to jump back to (i.e. a downward-pointing arrow in kunkunshi).
This identifier must be unique and there must be at least one corresponding
`jump`.

### `music`:array (required for chord)

An array of music event objects, as above. The only difference compared to the
`music` array of the root object is that events within a `chord` are to be
interpreted simultaneously.

### `position`:string (required for note)

A short mnemonic corresponding to the position:

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

### `type`:string (required)

This is either `note`, `rest`, or `chord`.

## `shaku`:string (optional)

Whether the shaku (尺) finger position represents 5 (`low`) or 6(`high`)
semitones above the open middle string. The default is `low`.

## `tempo`:number (optional)

The tempo of the piece in beats per minute. The default is 100.

## `title`:string (required)

This is the title of the piece.

## `tuning`:string (optional)

A mnemonic representing the tuning. The default is `h` or honchōshi.

| Mnemonic | Name   | Transliteration |
|----------|--------|-----------------|
| `h`      | 本調子 | honchōshi       |
| `2a`     | 二揚げ | niage           |
| `3s`     | 三下げ | sansage         |

## `version`:number (required)

This must be `1`.
