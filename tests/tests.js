var expect = require('chai').expect;

var instantiate = require('../dist/cjs/instantiator').instantiate;

var schema, expected, result;

describe('Primitives', function () {
  it('should instantiate string', function () {
    schema = {
      type: 'string'
    };
    result = instantiate(schema);
    expected = '';
    expect(result).to.deep.equal(expected);
  });

  it('should instantiate number', function () {
    schema = {
      type: 'number'
    };
    result = instantiate(schema);
    expected = 0;
    expect(result).to.deep.equal(expected);
  });

  it('should instantiate boolean', function () {
    schema = {
      type: 'boolean'
    };
    result = instantiate(schema);
    expected = false;
    expect(result).to.deep.equal(expected);
  });

  it('should instantiate null', function () {
    schema = {
      type: 'null'
    };
    result = instantiate(schema);
    expected = null;
    expect(result).to.deep.equal(expected);
  });

  it('should use default property', function () {
    schema = {
      type: 'number',
      default: 100
    };
    result = instantiate(schema);
    expected = 100;
    expect(result).to.deep.equal(expected);
  });

  it('should support array of types', function () {
    schema = {
      type: ['string', 'null']
    };
    result = instantiate(schema);
    expected = '';
    expect(result).to.deep.equal(expected);
  });
});

describe('Objects', function () {
  it('should instantiate object without properties', function () {
    schema = {
      type: 'object'
    };
    result = instantiate(schema);
    expected = {};
    expect(result).to.deep.equal(expected);
  });

  it('should instantiate object with property', function () {
    schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string'
        }
      }
    };
    result = instantiate(schema);
    expected = {
      title: ''
    };
    expect(result).to.deep.equal(expected);
  });

  it('should instantiate object with property with default value', function () {
    schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          default: 'Example'
        }
      }
    };
    result = instantiate(schema);
    expected = {
      title: 'Example'
    };
    expect(result).to.deep.equal(expected);
  });

  it('should instantiate object with more than one property', function () {
    schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          default: 'Example'
        },
        amount: {
          type: 'number',
          default: 10
        }
      }
    };
    result = instantiate(schema);
    expected = {
      title: 'Example',
      amount: 10
    };
    expect(result).to.deep.equal(expected);
  });
});

describe('AllOf', function () {
  it('should instantiate schema with allOf', function () {
    schema = {
      allOf: [
        {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            }
          }
        },
        {
          type: 'object',
          properties: {
            amount: {
              type: 'number',
              default: 1
            }
          }
        }
      ]
    };
    result = instantiate(schema);
    expected = {
      title: '',
      amount: 1
    };
    expect(result).to.deep.equal(expected);
  });
});

describe('Options', function () {
  it('should instantiate object without properties', function () {
    schema = {
      type: 'object'
    };
    result = instantiate(schema, { requiredPropertiesOnly: true });
    expected = {};
    expect(result).to.deep.equal(expected);
  });

  it('should instantiate object without property', function () {
    schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string'
        }
      }
    };
    result = instantiate(schema, { requiredPropertiesOnly: true });
    expected = {};
    expect(result).to.deep.equal(expected);
  });

  it('should instantiate object with only property', function () {
    schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string'
        },
        description: {
          type: 'string'
        }
      },
      required: ['title']
    };
    result = instantiate(schema, { requiredPropertiesOnly: true });
    expected = {
      title: ''
    };
    expect(result).to.deep.equal(expected);
  });

  it('should instantiate object with all properties', function () {
    schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string'
        },
        description: {
          type: 'string'
        }
      },
      required: ['title']
    };
    result = instantiate(schema, { requiredPropertiesOnly: false });
    expected = {
      title: '',
      description: ''
    };
    expect(result).to.deep.equal(expected);
  });

  it('should instantiate object with all properties when empty options', function () {
    schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string'
        },
        description: {
          type: 'string'
        }
      },
      required: ['title']
    };
    result = instantiate(schema, {});
    expected = {
      title: '',
      description: ''
    };
    expect(result).to.deep.equal(expected);
  });

  it('should instantiate object with an empty array', function () {
    expected = {
      todos: []
    };
    schema = {
      title: 'todo',
      type: 'object',
      properties: {
        todos: {
          type: 'array',
          items: {
            type: 'integer'
          }
        }
      },
      required: ['todos']
    };
    result = instantiate(schema, {});

    expect(result).to.deep.equal(expected);
  });

  it('should instantiate object with an array using minItems', function () {
    expected = {
      todos: [0, 0]
    };
    schema = {
      title: 'todo',
      type: 'object',
      properties: {
        todos: {
          type: 'array',
          items: {
            type: 'integer'
          },
          minItems: 2
        }
      },
      required: ['todos']
    };
    result = instantiate(schema, {});

    expect(result).to.deep.equal(expected);
  });

  it('should instantiate array with provided defaults', function () {
    expected = {
      todos: [1, 2, 3]
    };
    schema = {
      title: 'todo',
      type: 'object',
      properties: {
        todos: {
          type: 'array',
          default: [1, 2, 3],
          items: {
            type: 'integer'
          }
        }
      },
      required: ['todos']
    };
    result = instantiate(schema);

    expect(result).to.deep.equal(expected);
  });

  it('should instantiate array with provided function defaults', function () {
    expected = {
      todos: [1, 2, 3]
    };
    schema = {
      title: 'todo',
      type: 'object',
      properties: {
        todos: {
          type: 'array',
          items: {
            type: 'integer'
          }
        }
      },
      required: ['todos']
    };
    result = instantiate(schema, {
      defaults: {
        array: function () {
          return [1, 2, 3];
        }
      }
    });

    expect(result).to.deep.equal(expected);
  });

  it('should instantiate object with provided defaults', function () {
    schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string'
        },
        quantity: {
          type: 'number'
        }
      },
      required: ['title']
    };
    result = instantiate(schema, {
      defaults: {
        string: 'foo',
        number: 21
      }
    });
    expected = {
      title: 'foo',
      quantity: 21
    };
    expect(result).to.deep.equal(expected);
  });

  it('should instantiate object with provided function defaults', function () {
    schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string'
        },
        birthday: {
          type: 'string',
          format: 'date'
        }
      },
      required: ['start']
    };
    result = instantiate(schema, {
      defaults: {
        string: function (val) {
          var format = val.format;

          if (format && format === 'date') {
            return new Date(2021, 0, 1);
          }

          return '';
        }
      }
    });
    expected = {
      title: '',
      birthday: new Date(2021, 0, 1)
    };
    expect(result).to.deep.equal(expected);
  });
});

describe('References', function () {
  // Taken from https://spacetelescope.github.io/understanding-json-schema/structuring.
  it('should intantiate a simple reference', function () {
    schema = {
      definitions: {
        address: {
          type: 'object',
          properties: {
            street_address: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' }
          },
          required: ['street_address', 'city', 'state']
        }
      },

      type: 'object',

      properties: {
        billing_address: { $ref: '#/definitions/address' },
        shipping_address: { $ref: '#/definitions/address' }
      }
    };

    result = instantiate(schema);
    expected = {
      billing_address: { street_address: '', city: '', state: '' },
      shipping_address: { street_address: '', city: '', state: '' }
    };

    expect(result).to.deep.equal(expected);
  });

  it('should intantiate a simple reference', function () {
    schema = {
      definitions: {
        a: {
          type: 'object',
          properties: {
            x: { type: 'string', default: 'tomas' },
            y: { type: 'string' },
            z: { type: 'string' }
          }
        },
        b: {
          type: 'object',
          properties: {
            aaa: { type: 'string' },
            bbb: { $ref: '#/definitions/a' }
          }
        }
      },

      type: 'object',

      properties: {
        yo: { $ref: '#/definitions/b' }
      }
    };

    result = instantiate(schema);
    expected = {
      yo: { aaa: '', bbb: { x: 'tomas', y: '', z: '' } }
    };

    expect(result).to.deep.equal(expected);
  });

  // Taken from https://cswr.github.io/JsonSchema/spec/definitions_references.
  it('should instantiate a simple allOf reference', function () {
    schema = {
      definitions: {
        person: {
          type: 'object',
          required: ['first_name', 'last_name', 'age'],
          properties: {
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            age: { type: 'integer' }
          }
        },
        football_team: {
          type: 'object',
          required: ['name', 'league'],
          properties: {
            name: { type: 'string' },
            league: { type: 'string' },
            year_founded: { type: 'integer' }
          }
        }
      },
      allOf: [{ $ref: '#/definitions/person' }, { $ref: '#/definitions/football_team' }]
    };

    result = instantiate(schema);
    expected = {
      first_name: '',
      last_name: '',
      age: 0,
      name: '',
      league: '',
      year_founded: 0
    };

    expect(result).to.deep.equal(expected);
  });

  it('should instantiate a complex allOf reference', function () {
    schema = {
      definitions: {
        person: {
          type: 'object',
          required: ['first_name', 'last_name', 'age'],
          properties: {
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            age: { type: 'integer' }
          }
        },
        football_team: {
          type: 'object',
          required: ['name', 'league'],
          properties: {
            name: { type: 'string' },
            league: { type: 'string' },
            year_founded: { type: 'integer' }
          }
        }
      },
      allOf: [
        { $ref: '#/definitions/person' },
        {
          type: 'object',
          required: ['current_club'],
          properties: {
            current_club: { $ref: '#/definitions/football_team' }
          }
        }
      ]
    };

    result = instantiate(schema);
    expected = {
      first_name: '',
      last_name: '',
      age: 0,
      current_club: {
        name: '',
        league: '',
        year_founded: 0
      }
    };

    expect(result).to.deep.equal(expected);
  });

  it('should instantiate consts', function () {
    schema = {
      type: 'object',
      required: ['not_const', 'required_string_const', 'number_const', 'array_const', 'object_const'],
      properties: {
        not_const: {
          type: 'object',
          required: ['const'],
          properties: {
            const: { type: 'string', default: 'test' }
          }
        },
        required_string_const: {
          const: 'test'
        },
        not_required_string_const: {
          const: 'test'
        },
        number_const: {
          const: 0
        },
        array_const: {
          const: [1, 2, 3]
        },
        object_const: {
          const: {
            test: 'test'
          }
        }
      }
    };

    result = instantiate(schema);
    expected = {
      not_const: {
        const: 'test'
      },
      required_string_const: 'test',
      not_required_string_const: 'test',
      number_const: 0,
      array_const: [1, 2, 3],
      object_const: {
        test: 'test'
      }
    };

    expect(result).to.deep.equal(expected);
  });
});
