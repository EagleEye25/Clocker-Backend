/**
 * Controllers Common functions
 */
class controllerCommon {

    findSuccess(res) {
        return (result) => {
            res.status(200); // Found
            res.json(result);
        }
    }

    existsSuccess(res) {
        return (result) => {
            res.status(200); // Found
            res.json(result);
        }
    }

    editSuccess(res) {
        return (result) => {
            res.status(201); // Created/Updated/Deleted
            let temp = {};
            if (result) {
                temp = result;
            }
            res.json(temp);
        }
    }

    serverError(res) {
        return (error) => {
            res.status(500);
            res.json(error);
        }
    }

    findError(res) {
        return (error) => {
            res.status(404);
            res.json(error);
        }
    }
}

module.exports = controllerCommon;