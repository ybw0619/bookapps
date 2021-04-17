// src/server.js
import { createServer } from "miragejs"
import books from './isbn.json'
import _ from 'lodash'

// 테스트 아이디
const users = [{
  id: 'guest1',
  pw: 'guest1',
  name: '게스트1',
  thumbnail: 'https://pbs.twimg.com/profile_images/1342126577711104000/dDQwbY7I_400x400.jpg',
}, {
  id: 'guest2',
  pw: 'guest2',
  name: '게스트2',
  thumbnail: 'https://blog.kakaocdn.net/dn/bezjux/btqCX8fuOPX/6uq138en4osoKRq9rtbEG0/img.jpg',
}, {
  id: 'guest3',
  pw: 'guest3',
  name: '게스트3',
  thumbnail: 'https://img1.daumcdn.net/thumb/R720x0.q80/?scode=mtistory2&fname=http%3A%2F%2Fcfile10.uf.tistory.com%2Fimage%2F274B203A5914537B2F50DD',
}]

export function makeServer({ environment = "development" } = {}) {
  let server = createServer({
    environment,

    //책, 유저 초기값 세팅
    seeds(server) {
      
      server.db.loadData({
        books,
        users,
      })
    },

    routes() {
      this.namespace = "api"

      //로그인
      this.post("/login", (schema, req) => {
        let attr = JSON.parse(req.requestBody)

        //간략하게 아이디 패스워드 비교
        return schema.db.users.filter(user => {
          return user.id === attr.id && user.pw === attr.pw
        })
      })

      //대여 하기
      this.post("/borrow", (schema, req) => {
        let attr = JSON.parse(req.requestBody)

        let userId = attr.userId
        let bookId = attr.bookId

        let book = schema.db.books.where({id: bookId})

        if(book[0].borrower !== null || userId === undefined){
          return {
            result: 'fail'
          }
        } 

        return {
          result: 'success',
          data: schema.db.books.update(bookId, {
            borrower: userId
          })
        }
      })

      //대여한 책 조회
      this.get("/borrow", (schema, req) => {
        let userId = req.queryParams.id

        return schema.db.books.filter(book => book.borrower === userId)
      })
      
      //반납
      this.post("/return", (schema, req) => {
        let attr = JSON.parse(req.requestBody)

        let userId = attr.userId
        let bookId = attr.bookId

        let book = schema.db.books.where({id: bookId})

        if(book[0].borrower !== userId){
          return {
            result: 'fail'
          }
        } 

        return {
          result: 'success',
          data: schema.db.books.update(bookId, {
            borrower: null
          })
        }
      })

      //책 조회
      this.get("/books", (schema, req) => {
        let qp = req.queryParams
        let borrow =  (qp.borrow ==='true')
        let page = parseInt(qp.page) - 1
        let limit = parseInt(qp.limit)
        let start = page * limit
        let end = start + limit

        let searchOption = qp.searchOption
        let sortTarget = qp.sortTarget
        let sortOption = qp.sortOption
        
        let books = schema.db.books

        // 도서명 조회
        if(searchOption === 'title'){
          books = _.chain(books)
          .orderBy(sortTarget === 'title'? 'title' : 'authors', sortOption)
          .filter(book=>(
            book.title.toUpperCase().includes(qp.q.toUpperCase())
            && (borrow ? book.borrower === null : true)
          ))
          .value()
        }
        // 저자명 조회
        else if(searchOption === 'author'){
          books = _.chain(books)
          .orderBy(sortTarget === 'title'? 'title' : 'authors', sortOption)
          .filter(book => (
            book.authors.filter(author => {
              return author.toUpperCase().includes(qp.q.toUpperCase())
            }).length > 0 && (borrow ? book.borrower === null : true)))
          .value()
        }

        return {
          total : books.length,
          books : books.slice(start,end)
        }
      })

      this.post('books', (schema, req) => {
        return schema.db.books.insert({
          "title": "테스트",
          "author": "양호준",
          "isbn": 9788933339019
        })
      })
    },
  })

  return server
}