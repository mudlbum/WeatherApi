console.log("Hello, World!");

async function getData( key, city ) {
    try {
        const foobar = await fetch(
            `http://api.weatherapi.com/v1/current.json?q=${city}&key=${key}`
        );

        const infoFromServer = await foobar.json();
        console.log( infoFromServer );

    } catch (error) {
        console.warn(`Nope: ${error}`);
        // console.warn( "Nope: " + error );
    }
}
getData(
    '29a43923498e423e92d183223230102', 'Toronto'
);