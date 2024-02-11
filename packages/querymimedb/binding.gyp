{
  "targets": [
    {
      "target_name": "querymimedb",
      "sources": ["src/binding.cpp"],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').targets\"):node_addon_api",
        "<!(node -p \"require('node-addon-api').include\")",
        "<!(node -p \"require('node-addon-api').include_dir\")",
      ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "conditions": [
        ["OS!='win'", {
          "variables": {
            "libmagic_installed%": "<!(pkg-config --exists libmagic || echo no)",
          },
          "conditions": [
            ["'$(libmagic_installed)'=='yes'", {
              "defines": [ "HAVE_LIBMAGIC=1" ],
              "cflags!": [ "-fno-exceptions" ],
              "cflags_cc!": [ "-fno-exceptions" ],
              "include_dirs": [
                "<!(pkg-config --cflags-only-I libmagic | sed 's/-I//g')"
              ],
              "libraries": [
                "<!(pkg-config --libs libmagic)"
              ]
            }]
          ]
        }],
        ['OS=="mac"', {
            'cflags+': ['-fvisibility=hidden'],
            'xcode_settings': {
              'GCC_SYMBOLS_PRIVATE_EXTERN': 'YES', # -fvisibility=hidden
            }
        }]
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ]
    }
  ]
}
