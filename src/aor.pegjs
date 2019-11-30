{
  function toObject(iterable) {
    const result = {};
    for (const [key, value] of iterable) {
      if (value) result[key] = value;
    }
    return result;
  }
}

document
  = metadata:metadata
    newline
    music:music
    { return Object.assign({music: music, version: 1}, metadata) }

metadata
  = pairs:mdPair* { return toObject(pairs) }

mdPair
  = key:mdKey
    ws* ':' ws*
    value:mdValue
    newline
    { return [key, value] }

mdKey
  = str:[a-zA-Z]+ { return str.join("").toLocaleLowerCase() }

mdValue
  = str:[^\r\n]+ { return str.join("") }

music
  = ws* events:event*
  { return events }

event
  = chordEvent
  / noteEvent
  / restEvent

chordEvent
  = mark:mark?
    "["
    music:music
    "]"
    jump:jump?
    ws*
    {
      return toObject([
        ['type',  'chord'],
        ['mark',  mark],
        ['jump',  jump],
        ['music', music]
      ])
    }

noteEvent
  = mark:mark?
    mnemonic:mnemonic
    duration:duration?
    articulation:articulation?
    jump:jump?
    ws*
    {
      return toObject([
        ['type',         'note'],
        ['position',     mnemonic],
        ['duration',     duration || 1],
        ['articulation', articulation],
        ['mark',         mark],
        ['jump',         jump]
      ])
    }

restEvent
  = mark:mark?
    '0'
    duration:duration?
    jump:jump?
    ws*
    {
      return toObject([
        ['type',         'rest'],
        ['duration',     duration || 1],
        ['mark',         mark],
        ['jump',         jump]
      ])
    }

mark
  = '->' ws* { return 'A' }
  / markID:markID '>' ws* { return markID }

jump
  = ws* '<-' { return 'A' }
  / ws* '<' markID:markID { return markID }

markID
  = [A-Z]

mnemonic
  = letters:('g'? 'n'? [aor4ztsk56789]) { return letters.join("") }

duration
  = n:integer '/' d:integer { return parseInt(n) / parseInt(d) }
  / '/' d:integer { return 1 / parseInt(d) }
  / '/' { return 1/2 }
  / n:integer { return parseInt(n) }

articulation
  = '\'' { return "hammer" }
  / '^' { return "upstroke" }

ws
  = [ \t] / newline

newline
  = ('\r\n' / '\n')

integer
  = [0-9]+
