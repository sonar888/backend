const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error: error}))  
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes : 0,
        dislikes : 0

        
    });
    sauce.save()
        .then(sauce => res.status(201).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

    
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}))
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.likeSauce =  async (req, res, next) => {
    try {
      let sauce = await Sauce.findById(req.params.id)
      let userId = req.body.userId
      let like = req.body.like
      console.log(sauce)
     

      if (!sauce.usersLiked.includes(userId) && !sauce.usersDisliked.includes(userId) ) {
        switch (like) {
          case 1 : console.log("like");
          sauce.usersLiked.push(userId);
          sauce.likes = sauce.usersLiked.length;
          sauce.save();
          return res.status(201).json(sauce);
          break;

          case -1 : console.log("dislike");
          sauce.usersDisliked.push(userId);
          sauce.dislikes = sauce.usersDisliked.length
          sauce.save();
          return res.status(201).json(sauce);
          break;

          case 0 : console.log("0");
          return res.status(409 ).json({message: 'The request could not be completed due to a conflict with the current state of the resource'})
        }

      } else if (sauce.usersLiked.includes(userId)) {
        switch (like) {
          case 1 : console.log("1");
          return res.status(409).json({message: 'The user already liked this sauce'})
          break;

          case -1 : console.log("-1");
          return res.status(200).json({ message: 'The user cannot like and dislike the same sauce'});
          break;

          case 0 : console.log("remove like!");
          const index = sauce.usersLiked.indexOf(userId)
          sauce.usersLiked.splice(index, 1)
          sauce.likes = sauce.usersLiked.length;

          sauce.save()
          return res.status(200).json(sauce);
          break;
  
        }

      } else if (sauce.usersDisliked.includes(userId)) {

        switch (like) {
          case 1 : console.log("1");
          return res.status(409).json({message: 'The user cannot like and dislike the same sauce'})
          break;

          case -1 : console.log("-1");
          return res.status(200).json({ message: 'The user already disliked this sauce'});
          break;

          case 0 : console.log("remove dislike!");
          const index = sauce.usersDisliked.indexOf(userId)
          sauce.usersDisliked.splice(index, 1)
          sauce.dislikes = sauce.usersDisliked.length
          sauce.save()
          return res.status(200).json(sauce);
          break;
  
        }

        

      }

     
  
        console.log(userId, sauce.name)

    }

  
    catch (err) {
      console.log (err)
    }
    

  }

     

   
  //   Sauce.findById(req.params.id )
  //   .then(() => {
  //   const likeObject = JSON.parse(req.body.sauce);
  // //   const like = new Sauce({
  // //     ...likeObject
      
  // // });
  //   // const userId = sauceObject.userId
  //   // const like = sauceObject.like

  //   console.log(likeObject)

  //   })
    
    
    // sauce.save()
    //     .then(sauce => res.status(201).json(sauce))
    //     .catch(error => res.status(400).json({ error }));

    //await sauce findbyID
    //récupérer le user id et like dans le body
    // si user Id est présent dqns userliked; alors supprimer dans user like, sinon supprimer dans user dislike
        //faire un recherhche dans tableaux et supprimer dans le tableaux dans lequel il existe
    //mettre à jour la sauce
    //  Sauce.findById(req.params.id)
    // .then( sauce => {
    //   if (like === '1') {
    //     sauce.likes += 1 
    //     sauce.usersLiked.push(userId)
    //     console.log("He likes!")
    //     res.status(200).json(usersLiked)
    //   } else if ( like === '-1') {
    //     sauce.dislikes += 1 
    //     sauce.usersDisliked.push(userId)
    //     console.log("!")
    //     console.log("He dislikes!")
    //     res.status(200).json(usersDisliked)
    //   } else if (like ==='0') {
    //     // 
        // res.status(200).json({ message: sauceObject})
      // }
      




    // })
    // .catch(error => res.status(400).json({ error }))
 
