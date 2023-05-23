const fetchRequest = (arrayObjects) => {
  return new Promise((resolve) => {
    const arrayPromise = [];
    arrayObjects.forEach((object) => {
      const fetchPromise = fetch(object.href)
      arrayPromise.push(fetchPromise);
    })
    Promise.allSettled(arrayPromise).then((result) => {
      for (let i = 0; i < result.length; i++) {
        let okValue;
        if (result[i].status === 'fulfilled') { //Se valida el estado de la petición HTTP
          result[i].value.ok ? okValue = 'ok' : okValue = 'fail'
          arrayObjects[i].status = result[i].value.status
          arrayObjects[i].ok = okValue
        } else {
          okValue = 'fail'
          arrayObjects[i].status = 404
          arrayObjects[i].ok = okValue
        }
      }
      resolve(arrayObjects)
    })
  })
}

// 
fetchRequest([{ href: 'https://nodejs.org/api/process.html' }])
  .then(resp => {

    console.log(resp);
    process.exit()
  })
  .catch(err => err)
// setTimeout(() => {
//   console.log('¡Se ha terminado el temporizador!');
// }, 5000);