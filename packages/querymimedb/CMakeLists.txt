cmake_minimum_required(VERSION 3.15)
cmake_policy(SET CMP0091 NEW)
cmake_policy(SET CMP0042 NEW)

project(querymimedb)

add_definitions(-DNAPI_VERSION=7)

include_directories(${CMAKE_JS_INC})
include_directories(${NODE_ADDON_API_DIR})

# Check if the operating system is macOS
if(APPLE)
  # Add compile flags for macOS
  set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fvisibility=hidden")
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fvisibility=hidden")

  # For Xcode or Makefile projects, set the GCC_SYMBOLS_PRIVATE_EXTERN property to YES
  set_target_properties(querymimedb PROPERTIES
    XCODE_ATTRIBUTE_GCC_SYMBOLS_PRIVATE_EXTERN YES
  )
endif()

# Attempt to find libmagic
find_library(LIBMAGIC_LIBRARY NAMES magic)
find_path(LIBMAGIC_INCLUDE_DIR NAMES magic.h)

# Conditionally include the libmagic header directory
if(LIBMAGIC_INCLUDE_DIR AND LIBMAGIC_LIBRARY)
  include_directories(${LIBMAGIC_INCLUDE_DIR})
  add_definitions(-DLIBMAGIC_AVAILABLE)
else()
  message(STATUS "libmagic not found. MIME types will be un-queryable.")
endif()

file(GLOB SOURCE_FILES "src/binding.cpp")

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# Conditionally link against libmagic only if found
if(LIBMAGIC_LIBRARY)
  target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} ${LIBMAGIC_LIBRARY})
else()
  target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})
endif()

target_include_directories(${PROJECT_NAME} PUBLIC "${CMAKE_SOURCE_DIR}/node_modules/node-addon-api" "${CMAKE_SOURCE_DIR}/../../node-addon-api" "src")

if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
  # Generate node.lib
  execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
endif()
