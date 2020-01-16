# kks Kunkunshi interchange format (DRAFT)

    {
      "songs": [
        {
          "shaku": "high",
          "tempo": 100,
          "title": "Example",
          "tuning": "h",
          "type": "song",
          "music": [
            {
              "type": "box",
              "events": [
                {
                  "type": "note",
                  "mark": "A",
                  "offset": 1,
                  "stops": [
                    { "position": 0, "string": 2, "type": "stop" },
                    { "position": 1, "string": 3, "type": "stop" }
                  ]
                }
              ]
            },
            {
              "type": "box",
              "events": [
                {
                  "articulation": "upstroke",
                  "offset": 1,
                  "stops": [ { "position": 0, "string": 3, "type": "stop" } ],
                  "type": "note"
                }
              ]
            },
            {
              "type": "box",
              "events": [
                {
                  "offset": 1,
                  "stops": [ { "position": 1, "string": 2, "type": "stop" } ],
                  "type": "note"
                },
                {
                  "articulation": "hammer",
                  "jump": "A",
                  "offset": 2,
                  "size": "small",
                  "stops": [ { "position": 2, "string": 2, "type": "stop" } ],
                  "type": "note"
                }
              ]
            }
          ]
        }
      ],
      "type": "kunkunshi",
      "version": 1
    }

## File format (Version 1)

A `kks` file contains a single [JSON](https://www.json.org/) object.

The top level object has the following properties:

- `songs`: array (required)

  An array of one or more song objects.

- `version`: number (required)

  This must be `1`.

An application consuming a `kks` file must ignore any unrecognised properties.

## `song` object

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

## `note` event

Properties:

- `type`: `"note"`

- `offset`: number (required)

  This is the duration of the note as a fraction. In practice, this will be
  either `1` or `0.5`.

- `position`: string (required)

  The left-hand position for this note, measured from zero for the open string.

  | Position | Semitones | String 1 | String 2 | String 3    |
  |----------|-----------|----------|----------|-------------|
  | 0        | 0         | 合       | 四       | 工          |
  | 1        | 2         | 乙       | 上       | 五          |
  | 2        | 4         | 老       | 中       | 六          |
  | 3        | 5/6       | 下老     | 尺       | 七          |
  | 4        | 7         | 𠮵       | 下尺     | 八          |
  | 5        | 9         | 𫩘       | 㕶       | 九          |
  | 6        | 10/11     | 呎       | 佬       | 伬          |
  | 7        | 12        | 佮       | 伵       | 仜          |
  | 8        | 14        | 亿       | 仩       | 伍          |
  | 9        | 16        |          | 仲       | 𠆾          |
  | 10       | 17/18     |          |          | ⿰亻七      |
  | 11       | 19        |          |          | 仈          |
  | 12       | 21        |          |          | 仇          | 

  Semitone positions are provided for reference; some notes can appear at
  multiple positions depending on the scale or the song.

- `string`: number (required)

  This is an integer between 1 and 3, with 1 representing the lowest-pitched
  string.

- `accidental`: string (optional)

  This can be either `sharp` or `flat`.

- `articulation`: string (optional)

  This can be either `hammer` or `upstroke`.

## `jump` event

Jump back to the identically-labelled mark (i.e. an upward-pointing arrow in
kunkunshi). The same label can be used for multiple jumps but must
refer to an existing earlier `mark`.

Properties:

- `type`: `"jump"`

- `label`: string (required)

## `mark` event

Mark this event to jump back to (i.e. a downward-pointing arrow in kunkunshi).
This label must be unique and there must be at least one corresponding
`jump`.

Properties:

- `type`: `"mark"`

- `label`: string (required)

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
