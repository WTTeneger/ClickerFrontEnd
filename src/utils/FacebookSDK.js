export const initFacebookSdk = () => {
    return new Promise((resolve, reject) => {
        // Load the Facebook SDK asynchronously

        // window.fbAsyncInit = () => {
        window.FB.init({
            appId: '661752592239019',
            cookie: true,
            xfbml: true,
            version: 'v20.0'
            // version: '20'
        });
        resolve();
    });
};

export const getFacebookLoginStatus = () => {
    return new Promise((resolve, reject) => {
        window.FB.getLoginStatus((response) => {
            resolve(response);
        });
    });
};

export const fbLogin = () => {
    return new Promise((resolve, reject) => {
        window.FB.login((response) => {
            resolve(response)
        })
    })
}