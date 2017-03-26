import * as $ from 'jquery';

(window as any).$ = $;

const model = {
  definiteOrPossible: 'definite',
  key: {
    note: 'A' as string,
    adjective: 'maj' as string
  },
  possibleKeys: [] as string[]
}

const noteCodes: { [key: string]: number } = {
  'E':  0,
  'F':  1,
  'F#': 2,
  'G':  3,
  'G#': 4,
  'A':  5,
  'A#': 6,
  'B':  7,
  'C':  8,
  'C#': 9,
  'D':  10,
  'D#': 11
}

const noteNames: { [key: number]: string } = {
  0:  'E',
  1:  'F',
  2:  'F#',
  3:  'G',
  4:  'G#',
  5:  'A',
  6:  'A#',
  7:  'B',
  8:  'C',
  9:  'C#',
  10: 'D',
  11: 'D#'
}

/*
notes required to reduce to a key.
total 24 keys. after:
1 -> 14
2 -> 10
3 -> 6
4 -> 4
5 -> 4
6 -> 2
7 -> 2
*/

const allKeys = (() => {
  const keys: { [key: string]: string[] } = {};
  for (let i = 0; i < 12; i++) {
    const note = noteNames[i];
    keys[note + 'min'] = generateScale(note, 'min');
    keys[note + 'maj'] = generateScale(note, 'maj');
  }
  return keys;
})()

function generateScale(note: string, adj: string) {
  const n = noteCodes[note];
  let notes: number[] = [];
  if (adj === 'maj') {
    notes = [
      n, n + 2, n + 4,
      n + 5,
      n + 7, n + 9, n + 11,
    ]
  } else {
    notes = [
      n, n + 2, n + 3,
      n + 5,
      n + 7, n + 8, n + 10
    ]
  }
  return notes.map((n) => {
    const normalized = n % 12;
    return noteNames[normalized];
  })
}

function notesFitInKey(notes: string[], key: string) {
  const notesInKey = allKeys[key];
  for (let i = 0; i < notes.length; i++) {
    if (notesInKey.indexOf(notes[i]) === -1) {
      return false;
    }
  }
  return true;
}

function possibleKeys(notes: string[]) {
  const matches: string[] = [];
  for (let key in allKeys) {
    if (notesFitInKey(notes, key)) {
      matches.push(key);
    }
  }
  return matches;
}

function keySetNote(note: string) {
  model.key.note = note;
}

function keySetAdjective(adj: string) {
  model.key.adjective = adj;
}

function generateChords(note: string, adjective: string) {
  const notes = generateScale(note, adjective);
  const chords: string[] = [];
  notes.forEach((note, i) => {
    if (adjective === 'maj') {
      // maj min min maj maj min dim
      if (i === 0 || i === 3 || i == 4) {
        chords.push(note + 'maj');
      } else if (i === 1 || i === 2 || i === 5) {
        chords.push(note + 'min');
      } else {
        chords.push(note + 'dim');
      }
    } else {
      // min dim maj min min maj maj
      if (i === 0 || i === 3 || i === 4) {
        chords.push(note + 'min');
      } else if (i === 2 || i === 5 || i === 6) {
        chords.push(note + 'maj');
      } else {
        chords.push(note + 'dim');
      }
    }
  });
  return chords;
}

$('#key-note').on('change', (e) => {
  const note = $('#key-note').val();
  keySetNote(note);
  model.definiteOrPossible = 'definite';
  render();
})

$('#key-adjective').on('change', (e) => {
  const adj = $('#key-adjective').val();
  keySetAdjective(adj);
  model.definiteOrPossible = 'definite';
  render();
})

$('#melody-notes').on('change', (e) => {
  const notes: string[] = []
  $('#melody-notes').find(':selected').each((i, selected) => {
    notes.push($(selected).val());
  });
  model.definiteOrPossible = 'possible';
  model.possibleKeys = possibleKeys(notes);
  render();
})

function render() {
  if (model.definiteOrPossible === 'definite') {
    const key = model.key.note + model.key.adjective;
    $('#key-info').html('<b>' + key + '</b>' + ': ' + generateChords(model.key.note, model.key.adjective).join(', '));
  } else {
    $('#key-info').html('');
    model.possibleKeys.forEach((key, i) => {
      const note = key.indexOf('#') !== -1 ? key.slice(0, 2) : key[0];
      const adjective = key.indexOf('#') !== -1 ? key.slice(2) : key.slice(1);
      $('#key-info').append('<p>' + '<b>' + key + '</b>' + ': ' + generateChords(note, adjective).join(', ') + '</p>');
    })
  }
}

render();