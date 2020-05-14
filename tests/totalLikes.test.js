const totalLikes = require('../utils/list_helper').totalLikes

describe('Amount of likes', () => {
  test('when array is empty', () => {
    const blogs = []
    const result = totalLikes(blogs)
    expect(result).toBe(0)
  })

  test('with one blog', () => {
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
    const result = totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('with three blogs', () => {
    const listWithThreeBlogs = [
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
        title: 'nimi',
        author: 'Ilmala',
        url: 'http://www.jotain......',
        likes: 20,
        __v: 0
      }
    ]
    const result = totalLikes(listWithThreeBlogs)
    expect(result).toBe(35)
  })

})