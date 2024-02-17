import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import { expect } from 'chai'
import { errors } from 'com'
const { NotFoundError } = errors
import retrieveUserPosts from './retrieveUserPosts.js'
import { User, Post } from '../data/models.js'

import random from './helpers/random.js'

describe(retrieveUserPosts, () => {
    before(() => mongoose.connect(process.env.TEST_MONGO_URL))

    beforeEach(() => Promise.all([User.deleteMany(), Post.deleteMany()]))

    it('succed existing user', () => {
        return Promise.all([
            User.create({ name: random.name(), email: random.email(), password: random.password() }),
            User.create({ name: random.name(), email: random.email(), password: random.password() })
        ])
            .then(([user1, user2, user3]) => {
                return Promise.all([
                    Post.create({ author: user1.id, image: random.image(), text: random.text() }),
                    Post.create({ author: user2.id, image: random.image(), text: random.text() }),
                    Post.create({ author: user1.id, image: random.image(), text: random.text() })
                ])
                    .then(([post1, post2, post3]) => {
                        return retrieveUserPosts(user1.id)
                            .then(posts => {
                                expect(posts).to.exist
                                expect(posts).to.instanceOf(Array)
                                expect(posts).to.have.lengthOf(2)
                                //cada post tiene la informacion que he proporcionado arriba?
                            })
                    })
            })
    })

    it('fails on non-existing user', () => {
        const idUser = random.id()

        return retrieveUserPosts(idUser)
            .then(posts => { throw new Error('should not reach this point') })
            .catch(error => {
                expect(error).to.be.instanceOf(NotFoundError)
                expect(error.message).to.equal('user not found')
            })
    })

    after(() => mongoose.disconnect())
})
