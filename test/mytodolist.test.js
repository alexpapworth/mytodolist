const dragAndDrop = require('./drag-and-drop')

beforeAll(async () => {
  await page.goto('file:///'+process.cwd()+'/index.html')
})

describe('when typing in todo box', () => {
  beforeAll(async () => {
    await page.click('.input-container')
    await page.keyboard.type('Test todo')
  })

  it('should change on DOM', async () => {
    const todo = await page.evaluate(() => document.querySelector('.input-container .input').textContent)

    expect(todo).toEqual('Test todo')
  })

  it('should change in localStorage', async () => {
    const todoName = await page.evaluate(() => document.querySelector('.input-container .input').dataset.name)
    const content = await page.evaluate((todoName) => JSON.parse(localStorage.getItem(todoName)).content, todoName)
    
    expect(content).toEqual('Test todo')
  })

  afterAll(async () => {
    await page.click('#title')
  })
})

describe('when hovering on todo color', () => {
  beforeAll(async () => {
    todoName = await page.evaluate(() => document.querySelector('.input-container .input').dataset.name)
    originalColor = await page.evaluate(() => document.querySelector('.input-container .input').id)

    await page.hover('.input-container')
    await page.hover('.change-color')
    await page.hover('.color-box[data-color="pink"]')
  })

  it('should temporarily change on DOM', async () => {
    const color = await page.evaluate(() => document.querySelector('.input-container .input').id)

    expect(color).toEqual('pink')
  })

  it('should not change in localStorage', async () => {
    const color = await page.evaluate((todoName) => JSON.parse(localStorage.getItem(todoName)).color, todoName)

    expect(color).toEqual(originalColor)
  })

  it('should change back to original color when mouse moved away', async () => {
    await page.hover('#title')

    const color = await page.evaluate(() => document.querySelector('.input-container .input').id)

    expect(color).toEqual(originalColor)
  })

  afterAll(async () => {
    await page.hover('#title')
  })
})

describe('when clicking on todo color', () => {
  beforeAll(async () => {
    todoName = await page.evaluate(() => document.querySelector('.input-container .input').dataset.name)
    originalColor = await page.evaluate(() => document.querySelector('.input-container .input').id)

    await page.hover('.input-container')
    await page.hover('.change-color')
    await page.click('.color-box[data-color="pink"]')
  })

  it('should change on DOM', async () => {
    const color = await page.evaluate(() => document.querySelector('.input-container .input').id)

    expect(color).toEqual('pink')
  })

  it('should change in localStorage', async () => {
    const color = await page.evaluate((todoName) => JSON.parse(localStorage.getItem(todoName)).color, todoName)

    expect(color).toEqual('pink')
  })
})

describe('when clicking new todo button', () => {
  it('should add a new todo', async () => {
    const countOfTodos = await page.evaluate(() => document.querySelectorAll('.input-container').length)

    await page.click('.new-todo')

    const newCountOfTodos = await page.evaluate(() => document.querySelectorAll('.input-container').length)

    expect(newCountOfTodos).toEqual(countOfTodos + 1)
  })

  it('should change new todo hover to next color', async () => {
    const color = await page.evaluate(() => document.querySelector('.new-todo').dataset.hover)

    await page.click('.new-todo')

    const newColor = await page.evaluate(() => document.querySelector('.new-todo').dataset.hover)

    expect(newColor).not.toEqual(color)
  })
})

describe('when clicking delete todo button', () => {
  it('should delete the todo', async () => {
    const countOfTodos = await page.evaluate(() => document.querySelectorAll('.input-container').length)

    await page.hover('.input-container')
    await page.click('.delete-todo')

    const newCountOfTodos = await page.evaluate(() => document.querySelectorAll('.input-container').length)

    expect(newCountOfTodos).toEqual(countOfTodos - 1)
  })
})

describe('when dragging and dropping todo', () => {
  it('should change order on DOM', async () => {
    const firstTodo = await page.evaluate(() => document.querySelectorAll('.input-container .input')[0].id)
    const secondTodo = await page.evaluate(() => document.querySelectorAll('.input-container .input')[1].id)

    dragAndDrop(firstTodo, secondTodo)

    const newFirstTodo = await page.evaluate(() => document.querySelectorAll('.input-container .input')[0].id)
    const newSecondTodo = await page.evaluate(() => document.querySelectorAll('.input-container .input')[1].id)

    expect(newFirstTodo).toEqual(secondTodo)
    expect(newSecondTodo).toEqual(firstTodo)
  })

  it('should change order in localStorage', async () => {
    const localStorage = await page.evaluate(() => JSON.parse(localStorage.order))

    const firstTodo = await page.evaluate(() => document.querySelectorAll('.input-container .input')[0].id)
    const secondTodo = await page.evaluate(() => document.querySelectorAll('.input-container .input')[1].id)

    dragAndDrop(firstTodo, secondTodo)

    const newLocalStorage = await page.evaluate(() => JSON.parse(localStorage.order))
    
    expect(newLocalStorage[0]).toEqual(localStorage[1])
    expect(newLocalStorage[1]).toEqual(localStorage[0])
  })
})

describe('when changing title', () => {
  beforeAll(async () => {
    await page.click('#title', { clickCount: 3 })
    await page.keyboard.type('Cool New Title')
  })

  it('should update on DOM', async () => {
    const title = await page.evaluate(() => document.querySelector('#title').textContent)

    expect(title).toEqual('Cool New Title')
  })

  it('should update in localStorage', async () => {
    const localStorage = await page.evaluate(() => JSON.parse(localStorage.title))

    expect(localStorage).toEqual('Cool New Title')
  })
})


