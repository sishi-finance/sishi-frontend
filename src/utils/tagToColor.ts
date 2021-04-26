
const tagMapping = {
  "deprecated" : "#ffc107",
}


const getColorFromTag = (tag: string) => {
  return tagMapping[tag.toLowerCase()]
}

export default getColorFromTag