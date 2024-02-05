
#include <napi.h>

#ifdef LIBMAGIC_AVAILABLE
#include <filesystem>
#include <iostream>
#include <magic.h>

namespace fs = std::filesystem;
#endif

Napi::String QueryMimeType(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1 || !info[0].IsString()) {
    Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
    return Napi::String::New(env, "");
  }

#ifdef LIBMAGIC_AVAILABLE
  Napi::String fileName = info[0].As<Napi::String>();
  std::string fileStr = fileName.Utf8Value();

  if (!fs::exists(fileStr)) {
    return Napi::String::New(env, "ERR_ENOENT");
  }

  std::string mimeType = "";

  const magic_t magic = magic_open(MAGIC_MIME_TYPE);
  if (magic == NULL) {
    return Napi::String::New(env, "ERR_NO_LIBMAGIC");
  }

  if (magic_load(magic, NULL) != 0) {
    magic_close(magic);
    return Napi::String::New(env, "ERR_NO_MAGIC_DB");
  }

  const char *mime = magic_file(magic, fileStr.c_str());
  if (mime != NULL) {
    mimeType = std::string(mime);
  } else {
    mimeType = "ERR_CANNOT_FIND_MIME_TYPE";
  }

  magic_close(magic);

  return Napi::String::New(env, mimeType);
#else
  return Napi::String::New(env, "ERR_NOT_BUILT_WITH_LIBMAGIC");
#endif
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "queryMimeType"),
              Napi::Function::New(env, QueryMimeType));
  return exports;
}

NODE_API_MODULE(mime_type_module, Init);
