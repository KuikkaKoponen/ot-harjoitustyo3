const mostLikes = require('../utils/list_helper').mostLikes

describe('Most likes', () => {
  test('when array is empty', () => {
    const blogs = []
    const result = mostLikes(blogs)
    expect(result).toEqual({})
  })

  test('with one blog', () => {
    const test = {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    }
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]
    const result = mostLikes(listWithOneBlog)
    expect(result).toEqual(test)
  })

  test('with two blogs from same author', () => {
    const test = {
      author: 'Edsger W. Dijkstra',
      likes: 15,
    }
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 10,
        __v: 0
      }
    ]
    const result = mostLikes(listWithOneBlog)
    expect(result).toEqual(test)
  }),

  test('with many blogs from many authors', () => {
    const test = {
      author: 'Pekkala',
      likes: 130,
    }
    const listWithOneBlog = [
      {
        _id: '1234',
        title: 'Blogin nimi yksi',
        author: 'Pekkala',
        url: 'url',
        likes: 20,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f81000',
        title: 'Go To Statement Considered Harmful osa 1',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      },
      {
        _id: '1234',
        title: 'Blogin nimi yksi',
        author: 'Pekkala',
        url: 'url',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      },
      {
        _id: '1234',
        title: 'Blogin nimi',
        author: 'Pekkala',
        url: 'url',
        likes: 100,
        __v: 0
      },
    ]
    const result = mostLikes(listWithOneBlog)
    expect(result).toEqual(test)
  })
})