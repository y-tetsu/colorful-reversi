console.log('[ui_test.js]');

// getGameTurnText
assertEqual(getGameTurnText(B),             'Black', 'getGameTurnText 1');
assertEqual(getGameTurnText(W),             'White', 'getGameTurnText 2');
assertEqual(getGameTurnText('not defined'), 'End',   'getGameTurnText 3');
