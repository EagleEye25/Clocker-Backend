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
        return () => {
            res.status(201); // Created/Updated/Deleted
            res.json({});
        }
    }

    serverError(res) {
        return (error) => {
            res.status(500);
            res.json(error);
        }
    }

    findError(res) {
        res.status(400); // Not found
        return res.json("error 400");
    }
}

module.exports = controllerCommon;