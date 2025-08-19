const res200 = (res, result = null) => {
	res.send(result);
};

const res500 = (res) => {
	res.status(500).send('Something is broke!');
};

const res400 = (res, msg = null) => {
	res.status(400).send(msg);
};

const res409 = (res) => {
	res.status(409).send('Already Exist');
};

const res404 = (res) => {
	res.status(404).send('Page Not Found');
};

export default {
    res200, res500, res400, res409, res404
}