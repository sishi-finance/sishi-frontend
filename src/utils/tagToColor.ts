
const tagMapping = {
  "deprecated" : "#ffc107",
  "action required" : "#ff5555",
}


const getColorFromTag = (tag: string) => {
  return tagMapping[tag.toLowerCase()]
}

export default getColorFromTag