
/**
 * @param {String} recID This is the recruitIDs reference Id
 * @param {boolean} approved This is the Authorixed to purchase boolean 
 */
function displayAllRecsByID(recID, approved) {
    return new Promise(function (resolve, reject) {
        Recruit.find({ custoRef: recID }).then(function (recruitsOrListOfRec) {
            var count = 0;
            recruitsOrListOfRec.forEach(function (element) {
                count++;

            }, this);

            if (count > 0) {
                resolve(recruitsOrListOfRec);
            } else {
                reject('No recruits found with that recruitID Reference');
            }

        }).catch(function (err) {
            reject('error occured displaying recruitID recruits by custoRef. check recruitIDId');
        });
    })
}

function viewNewRecruit(newRecruitsID) {
    return new Promise(function (resolve, reject) {
        Recruit.findOne({ orderRef: newRecruitsID }).then(function (returnNewRecruit) {
            resolve(returnNewRecruit);

        }).catch(function (err) {
            reject('error occured. check recruitID or Params. recID authorisation not updated');
        });
    })
}

module.exports = { displayAllRecsByID, viewNewRecruit };
