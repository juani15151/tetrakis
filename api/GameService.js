const Encrypter = require('./Encrypter');
const GameCore = require('./GameCore');
const Game = require('./Game');
const express = require('express');
const router = express.Router();

let gameCore = new GameCore();
/**
 * This file is responsible of all the available game actions and interaction with the players, which are then processed using the GameCore class.
 *
 * TODO: Remove this class and use the Game.js class instead.
 */
router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

router.get('/number/random', function (req, res) {
    const rand = gameCore.generateNumber();
    const hiddenNumber = Encrypter.encrypt(rand);
    res.send(hiddenNumber);
});

router.get('/number/hide', function (req, res) {
    let number = req.query['number'];

    if (!gameCore.isValidNumber(number)) {
        res.status(400).send('Invalid number');
    }

    let hiddenNumber = Encrypter.encrypt(number)
    res.send(hiddenNumber);
});

router.get('/number/check', function (req, res) {
    const guessNumber = req.query['number'];
    if (!gameCore.isValidNumber(guessNumber)) {
        res.status(400).send('Invalid guess number');
    }

    const hiddenTarget = req.query['target'];
    const targetNumber = Encrypter.decrypt(hiddenTarget);
    if (!gameCore.isValidNumber(targetNumber)) {
        res.status(400).send('Invalid target number');
    }

    const result = gameCore.checkNumber(guessNumber, targetNumber);
    res.json(result);
});

module.exports = router;