export function formatFrequency(frequency: number, quantifier: string = '') {
  if(frequency < 100000) return `${frequency}${quantifier}` 
  if(frequency < 100000000) return `${(frequency/10000).toFixed(0)}万${quantifier}`
  return `${(frequency/100000000).toFixed(0)}亿${quantifier}`
}

export function formatTime(time: number) {
  const minute = Math.floor(time / 60)
  const second = Math.floor(time % 60)
  return `${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`  
}

export function parseLyric(lyric: string, translation: string): ({
  time: number,
  lyric: string,
  translation: string
})[] {
  if(!lyric) return []

  const parse = (lyric: string) => {
    if(!lyric) return []

    const lines = lyric.split('\n')
    return lines.map(line => {
      const [s1, s2] = line.split(']')
      const [minute, second] = s1.slice(1).split(':')
      const time = +(Number(minute) * 60 + Number(second)).toFixed(3)
      const text = s2 && s2.trim()
      
      return {
        time,
        lyric: text,
      }
    }).filter(({ time }) => !Number.isNaN(time))
  }
  
  const parsedLyric = parse(lyric)
  const parsedTranslation = parse(translation)
  const dis = parsedLyric.length - parsedTranslation.length
  
  return (
    parsedTranslation.length 
    ? parsedLyric.map(({ time, lyric }, i) => ({ time, lyric, translation: i < dis ? '' : parsedTranslation[i].lyric }))
    : parsedLyric.map(({ time, lyric }) => ({ time, lyric, translation: '' })))
}