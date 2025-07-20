# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.0.1](https://github.com/Nevimmu/kinkhoot/compare/v0.0.0...v0.0.1) (2025-07-20)


### Features

* **frontend:** now with confetti! ([66f6963](https://github.com/Nevimmu/kinkhoot/commit/66f6963a2559d65fa60b81e10f0eb4d1ca59bffb))
* **frontend:** show the release number on the homepage ([01963ef](https://github.com/Nevimmu/kinkhoot/commit/01963ef4551e9485c8ab171b77650f9fc3eff0ed))


### Bug Fixes

* **frontend:** fix checkPlayerName ([e1e990e](https://github.com/Nevimmu/kinkhoot/commit/e1e990e57ba197b1639804d4109952cd74552dec))

## 0.0.0 (2025-07-20)


### Features

* added game creation ([866d458](https://github.com/Nevimmu/kinkhoot/commit/866d458a8f7a638b021fc6e24b4c658373dc3ed9))
* **backend:** add the results from the url to the player ([385795d](https://github.com/Nevimmu/kinkhoot/commit/385795df9efd358ccca0aa79b9a01e753070d5d9))
* **backend:** delete players on game deletion ([bde7e28](https://github.com/Nevimmu/kinkhoot/commit/bde7e2818a705239f6b002f4cbd65dc7b1423bc8))
* **backend:** setup the backend collections ([af1f337](https://github.com/Nevimmu/kinkhoot/commit/af1f337fbc8206ef2bf17e9cb0f3678e2543c23d))
* **frontend:** add pinia persiststate ([24752a3](https://github.com/Nevimmu/kinkhoot/commit/24752a3af633c02f43fc3854e1e98dda5bef3fb2))
* **frontend:** added game code validation before adding a player to a game ([1a74adc](https://github.com/Nevimmu/kinkhoot/commit/1a74adcb5d79de9324b49f6c4f4538218654467e))
* **frontend:** added generateRandomCode ([9f5a5ba](https://github.com/Nevimmu/kinkhoot/commit/9f5a5ba56282fcb2de0518ad5e29805da7abe2e5))
* **frontend:** check if a game code is valid after clicking Join ([8078b6d](https://github.com/Nevimmu/kinkhoot/commit/8078b6d56cb41cbc57d512a053f320a2f2dfdbb0))
* **frontend:** check if the username is already taken in the game ([f65d0cf](https://github.com/Nevimmu/kinkhoot/commit/f65d0cfcdb5368e8fd77986bcbf898a0185a1298))
* **frontend:** count votes and display the results ([d318eaf](https://github.com/Nevimmu/kinkhoot/commit/d318eaf8cbae604f31f069b52f84479476e41167))
* **frontend:** create a randomized list of rounds ([f9b5feb](https://github.com/Nevimmu/kinkhoot/commit/f9b5febe394771b291d90720c30ab35d30c5238f))
* **frontend:** created the homeView and deleted unused code ([19baa75](https://github.com/Nevimmu/kinkhoot/commit/19baa7563cee87f3120f81073b35c7fb51aafd82))
* **frontend:** created the host view template ([7b8779e](https://github.com/Nevimmu/kinkhoot/commit/7b8779eaac26d7061be920d3787710de27fecdb3))
* **frontend:** detect once everyone voted ([69ddde4](https://github.com/Nevimmu/kinkhoot/commit/69ddde488ae5b9aa84db80bd4630ef5ec0d779d4))
* **frontend:** fetch a new round data ([a510639](https://github.com/Nevimmu/kinkhoot/commit/a510639d5469148fb430da3520eb2e52833baa29))
* **frontend:** has_voted is saved for the player and reset on a new round ([94e2c92](https://github.com/Nevimmu/kinkhoot/commit/94e2c92be197e5ea55dcfeadbf0cffc74f88b0dd))
* **frontend:** hide Join in the button when disabled ([d9cf0b5](https://github.com/Nevimmu/kinkhoot/commit/d9cf0b59a926c1ffafc65526888c9a099a46eaae))
* **frontend:** host get the players and game updates ([9a41ef8](https://github.com/Nevimmu/kinkhoot/commit/9a41ef81363937d707147fd1b8bbdd6fff7cf3b3))
* **frontend:** moved game logic to pinia store ([89b69ad](https://github.com/Nevimmu/kinkhoot/commit/89b69ad0bdc3dbc858cbccbdf2e16511ffc4dd0d))
* **frontend:** moved gamecode logic to router ([026b305](https://github.com/Nevimmu/kinkhoot/commit/026b3051eb00ef6286c1f07d35e83d564e0f2e5a))
* **frontend:** pass to the next round once everyone voted ([30f600a](https://github.com/Nevimmu/kinkhoot/commit/30f600a3005cadb2fab5bb08405321a643b62af4))
* **frontend:** player can join game ([4b7e58a](https://github.com/Nevimmu/kinkhoot/commit/4b7e58aa4427c8281c41c2aeb597201839a1b7bc))
* **frontend:** player now get game data ([b4fd0be](https://github.com/Nevimmu/kinkhoot/commit/b4fd0be6e0ea73bb177d02c1764899d6784be380))
* **frontend:** players can now vote ([28bda63](https://github.com/Nevimmu/kinkhoot/commit/28bda63ba2ea55e7a24ee145f98194882736d493))
* **frontend:** reset game and player store when creating a new game ([ed0d026](https://github.com/Nevimmu/kinkhoot/commit/ed0d0267259c9328a3f8097a1d7d9fe339b5d400))
* **frontend:** show error toast and push to / if the gamecode doesn't exist ([e0ed6b3](https://github.com/Nevimmu/kinkhoot/commit/e0ed6b375929b5bcd6229973eceaba7ed221c2b5))
* **frontend:** show the finish screen once the game reach the end ([32274a4](https://github.com/Nevimmu/kinkhoot/commit/32274a4e5f2f5dd24ddfc99760bdda4daaedaef0))
* **frontend:** show the results with a progress bar, % and name ([36affa2](https://github.com/Nevimmu/kinkhoot/commit/36affa25167dbcf552ee7b70e0a23b7966a9dfb0))
* **frontend:** subscribed collection now gets unsubscribed on unmount ([5ff3bff](https://github.com/Nevimmu/kinkhoot/commit/5ff3bff94cf009d535308e74ad413b9108224529))


### Bug Fixes

* **frontend:** changed gameID to gameCode in the router ([7e302b8](https://github.com/Nevimmu/kinkhoot/commit/7e302b8f84d47d2fe358bdbec98c63625ba2e1d2))
* **frontend:** fix the host reload ([c9f1ab3](https://github.com/Nevimmu/kinkhoot/commit/c9f1ab35b05dab82278765b5f0fdaacdabf9a31f))
* **frontend:** player get updated players ([f8b5045](https://github.com/Nevimmu/kinkhoot/commit/f8b5045b28f93a32c38da4fca11f188afb7297f2))
* **frontend:** typo ([3997fb0](https://github.com/Nevimmu/kinkhoot/commit/3997fb058d00b96ee8dedcdce2cf0c996ce63ca4))
* **frontend:** use the corect game id ([1055333](https://github.com/Nevimmu/kinkhoot/commit/1055333d8bcad7e99acb0808be3286f58f6973ac))
