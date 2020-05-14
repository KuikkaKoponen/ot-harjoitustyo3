const favoriteBlog = require('../utils/list_helper').favoriteBlog

describe('Favorite blog', () => {
  test('when array is empty', () => {
    const blogs = []
    const result = favoriteBlog(blogs)
    expect(result).toEqual({})
  })

  test('with one blog', () => {
    const test = {
      title: 'Go To Statement Considered Harmful',
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
    const result = favoriteBlog(listWithOneBlog)
    expect(result).toEqual(test)
  })

  test('with four blogs', () => {
    const test = {
      title: 'nimi2',
      author: 'Ilmala',
      likes: 20
    }

    const listWithFourBlogs = [
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
      },
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'nimi2',
        author: 'Ilmala',
        url: 'http://www.jotain......',
        likes: 20,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'nimi',
        author: 'Ilmala',
        url: 'http://www.jotain......',
        likes: 10,
        __v: 0
      }
    ]
    const result = favoriteBlog(listWithFourBlogs)
    expect(result).toEqual(test)
  })
})