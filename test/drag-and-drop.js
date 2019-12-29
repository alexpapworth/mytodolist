async function dragAndDrop(source, target) {
  await page.evaluate((source, target) => {
    source = document.querySelector('#'+source)

    event = document.createEvent("CustomEvent")
    event.initCustomEvent("mousedown", true, true, null)
    event.clientX = source.getBoundingClientRect().top
    event.clientY = source.getBoundingClientRect().left
    source.dispatchEvent(event)

    event = document.createEvent("CustomEvent")
    event.initCustomEvent("dragstart", true, true, null)
    event.clientX = source.getBoundingClientRect().top
    event.clientY = source.getBoundingClientRect().left
    source.dispatchEvent(event)

    event = document.createEvent("CustomEvent")
    event.initCustomEvent("drag", true, true, null)
    event.clientX = source.getBoundingClientRect().top
    event.clientY = source.getBoundingClientRect().left
    source.dispatchEvent(event)

    target = document.querySelector('#'+target)
    target.classList.add('ghost')

    event = document.createEvent("CustomEvent")
    event.initCustomEvent("dragover", true, true, null)
    event.clientX = target.getBoundingClientRect().top
    event.clientY = target.getBoundingClientRect().left
    target.dispatchEvent(event)

    event = document.createEvent("CustomEvent")
    event.initCustomEvent("drop", true, true, null)
    event.clientX = target.getBoundingClientRect().top
    event.clientY = target.getBoundingClientRect().left
    target.dispatchEvent(event)

    event = document.createEvent("CustomEvent")
    event.initCustomEvent("dragend", true, true, null)
    event.clientX = target.getBoundingClientRect().top
    event.clientY = target.getBoundingClientRect().left
    target.dispatchEvent(event)
  }, source, target)
}

module.exports = dragAndDrop