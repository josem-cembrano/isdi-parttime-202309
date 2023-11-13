function Home(props) {
    console.log('Home')

    const viewState = React.useState(null)

    const view = viewState[0]
    const setView = viewState[1]

    const timestampState = React.useState(null)
    //const timestamp = timestampState[0]
    const setTimestamp = timestampState[1]

    function handleLogoutClick() {
        logic.logoutUser()

        props.onLogoutClick()
    }

    let name = null

    try {
        const user = logic.retrieveUser()

        name = user.name
    } catch (error) {
        alert(error.message)
    }

    function handleProfileClick(event) {
        event.preventDefault()

        setView('profile')
    }

    function handleHomeClick(event) {
        event.preventDefault()

        setView(null)
    }

    function handleNewPostClick() {
        setView('new-post')
    }

    function handleCancelNewPostClick(event) {
        event.preventDefault()

        setView(null)
    }

    function handleChangeEmailSubmit(event) {
        event.preventDefault()

        const newEmail = event.target.querySelector('#new-email-input').value
        const newEmailConfirm = event.target.querySelector('#new-email-confirm-input').value
        const password = event.target.querySelector('#password-input').value

        try {
            logic.changeUserEmail(newEmail, newEmailConfirm, password)

            alert('Email changed successfully')

            setView(null)
        } catch (error) {
            alert(error.message)
        }
    }

    function handleChangePasswordSubmit(event) {
        event.preventDefault()

        const password = event.target.querySelector('#password-input').value
        const newPassword = event.target.querySelector('#new-password-input').value
        const newPasswordConfirm = event.target.querySelector('#new-password-confirm-input').value

        try {
            logic.changeUserPassword(password, newPassword, newPasswordConfirm)

            alert('Password changed successfully')

            setView(null)
        } catch (error) {
            alert(error.message)
        }
    }

    let posts = null

    try {
        posts = logic.retrievePosts()

        posts.reverse()
    } catch (error) {
        alert(error.message)
    }

    function handleNewPostSubmit(event) {
        event.preventDefault()

        const image = event.target.querySelector('#image-input').value
        const text = event.target.querySelector('#text-input').value

        try {
            logic.publishPost(image, text)

            setView(null)
        } catch (error) {
            alert(error.message)
        }
    }

    function handleToggleLikePostClick(postId) {
        try {
            logic.toggleLikePost(postId)

            setTimestamp(Date.now())
        } catch (error) {
            alert(error.message)
        }
    }

    function handleDeletePostClick(postId) {
        if (confirm('Are you sure you want to delete this post?')) {
            try {
                logic.deletePost(postId)

                setTimestamp(Date.now())
            } catch (error) {
                alert(error.message)
            }
        }

        return
    }

    function handleToggleFavPostClick(postId) {
        try {
            logic.toggleFavPost(postId)

            setTimestamp(Date.now())
        } catch (error) {
            alert(error.message)
        }
    }

    function handleFavListClick(event) {
        event.preventDefault()

        setView('favlist')
    }

    let userFavPosts = null

    try {
        userFavPosts = logic.retrieveFavPosts()
        //necesito que me devuelva un array con los posts favoritos del usuario conectado
    } catch (error) {
        alert(error.message)
    }

    return <div>
        <header className="home-header">
            <button href="button-home" onClick={handleHomeClick}style={{ boxShadow:'0 2px 4px rgba(0, 0, 0, 0.6)'}}>Home</button>

            <div>
                <a href="" onClick={handleProfileClick}>{name}</a>
                <button onClick={handleNewPostClick} style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.6'}}>+</button>
                <button onClick={handleFavListClick} style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.6'}}>Fav list</button>
                <button onClick={handleLogoutClick} style={{ boxShadow: '0 2px 4px rgba(255, 0, 0, 0.6'}}>Logout</button>
            </div>
        </header>

        {view === 'profile' && <div className="view">
            {console.log('Profile view')}
            <h2>Update e-mail</h2>

            <form className="form" onSubmit={handleChangeEmailSubmit}>
                <label htmlFor="new-email-input">New e-mail</label>
                <input id="new-email-input" type="email" />

                <label htmlFor="new-email-confirm-input">Confirm new e-mail</label>
                <input id="new-email-confirm-input" type="email" />

                <label htmlFor="password-input">Password</label>
                <input type="password" id="password-input" />

                <button type="submit">Update e-mail</button>
            </form>

            <h2>Update password</h2>

            <form className="form" onSubmit={handleChangePasswordSubmit}>
                <label htmlFor="password-input">Current password</label>
                <input type="password" id="password-input" />

                <label htmlFor="new-password-input">New password</label>
                <input id="new-password-input" type="password" />

                <label htmlFor="new-password-confirm-input">Confirm new password</label>
                <input id="new-password-confirm-input" type="password" />

                <button type="submit">Update password</button>
            </form>
        </div>}

        {view === 'new-post' && <div className="view">
            {console.log('new post view')}
            <h2>New post</h2>

            <form className="form" onSubmit={handleNewPostSubmit}>
                <label htmlFor="image-input">Image</label>
                <input type="url" id="image-input" />

                <label htmlFor="text-input">Text</label>
                <input type="text" id="text-input" />

                <button type="submit">Post</button>
                <button onClick={handleCancelNewPostClick}>Cancel</button>
            </form>
        </div>}

        {view !== 'profile' && view !== 'favlist' && posts !== null && <div>
            {console.log('normalview')}
            {posts.map((post) => {
                function handleToggleLikeButtonClick() {
                    handleToggleLikePostClick(post.id)
                }

                function handleDeletePostButtonClick() {
                    handleDeletePostClick(post.id)
                }

                function handleToggleFavPostButtonClick() {
                    handleToggleFavPostClick(post.id)
                }

                return <article key={post.id} className="post">
                    <h2>{post.author.name}</h2>
                    <img className="post-image" src={post.image} />
                    <p>{post.text}</p>
                    <button onClick={handleToggleLikeButtonClick} style={{ color: post.liked ? 'green' : 'red'
                    }}>{post.liked ? '❤️' : '🤍'} {post.likes.length} likes</button>
                    {post.author.id === logic.sessionUserId && <button onClick={handleDeletePostButtonClick}>Delete Post</button>}
                    <button onClick={handleToggleFavPostButtonClick} style={{ boxShadow: post.fav ? '0 4px 4px rgba(0, 255, 0, 0.8)' : '0 4px 4px rgba(255, 0, 0, 0.8)'
                    }}>{post.fav ? '🥰' : '😶'} fav</button>
                </article>
            })}
        </div>}

        {view === 'favlist' && <div style={{ textAlign: 'center' }}>
            <h2 className="Favs-List color-tittle"> My Favorites List</h2>
            {console.log('favlist')}

            {userFavPosts.map((post) => {

                function handleToggleFavPostButtonClick() {
                    handleToggleFavPostClick(post.id)
                }

                return <article key={post.id} className="post">
                    <h2>{post.author.name}</h2>
                    <img className="post-image" src={post.image} />
                    <p>{post.text}</p>
                    <button onClick={handleToggleFavPostButtonClick}>{post.fav ? '🥰' : '😶'} fav</button>
                </article>
            })}
        </div>}
    </div>
}