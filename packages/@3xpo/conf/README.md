# @3xpo/conf

A Micro Configuration Library. You're most likely better off writing your own library than adding this to your supply chain; I mainly made this as a small utility for myself.

## Overview

`@3xpo/conf` is a micro configuration library designed for simplicity, minimalism and ease of use. It provides a lightweight solution for managing configurations in your projects.

## Installation

Install the library using your preferred package manager:

```zsh
pnpm i @3xpo/conf
```

## Usage

### Getting Started

To start using `@3xpo/conf`, import the library and create an instance of the `Config` class:

```typescript
import Config from '@3xpo/conf';

const defaultConfig = {
  someConfig: 'hi',
};

export class YourClass {
  public config = new Config(defaultConfig);
}

export default YourClass;
```

### Changing Configuration Values

```typescript
const yourClass = new YourClass();
yourClass.config.get('someConfig'); // => 'hi'
yourClass.config.set('someConfig', 'hello!');
yourClass.config.get('someConfig'); // => 'hello!'
yourClass.config.reset(); // you can also pass a key here to ONLY reset that one key
yourClass.config.get('someConfig'); // => 'hi'
```
