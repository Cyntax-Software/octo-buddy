#![deny(warnings)]

use std::{thread, time};
use curl::easy::Easy;

pub fn main() {
    let mut retry_count = 0;
    let mut body: String = fetch_react_response();

    while body.is_empty() {
        retry_count += 1;
        thread::sleep(time::Duration::from_millis(2000));
        println!("fetch_react_response: retry #{}", retry_count);
        body = fetch_react_response();
    }

    web_view::builder()
        .title("React Rust App")
        .content(web_view::Content::Html(body))
        .size(800, 600)
        .resizable(true)
        .debug(true)
        // TODO: wots dis?
        .user_data(())
        .invoke_handler(|webview, arg| {
            match arg {
                "request_ip" => {
                    webview.eval(&format!("receiveIp({})", "'192.168.1.4'"))?;

                    println!("SEND IP ADDRESS");
                }
                _ => unimplemented!(),
            };

            Ok(())
        })
        .run()
        .unwrap();
}

fn fetch_react_response() -> String {
    println!("FETCH REACT RESPONSE");
    // TODO: in production we read and serve the build file?

    let url = "http://127.0.0.1:19006"; // TODO: custom port

    let mut data = Vec::new();
    let mut handle = Easy::new();
    let index_url = &format!("{}/index.html", url);
    handle.url(index_url).unwrap();

    // TODO: Learn what the curlly brackets are for
    //       - does it wait for this code to complete before continuing?
    {
        let mut transfer = handle.transfer();
        transfer.write_function(|new_data| {
        data.extend_from_slice(new_data);
            Ok(new_data.len())
        }).unwrap();
        transfer.perform().unwrap_or_else(|_e| {
            // NOTE: this block prevents app from blowing up
            // TODO: why?
        });
    }

    let body: String = String::from_utf8_lossy(&data).replace("src=\"", &format!("src=\"{}", url));

    body
}

// fn read_file(filepath: &str) -> String {
//   let dir = format!("{:?}", env::current_exe())
//       .replace("MacOS/cyntax-animate", "MacOS/build")
//       .replace("Ok(\"", "")
//       .replace("\")", "");

//   let path = format!("{}/{}", dir, filepath);
//   println!("read_file: {}", path);

//   let file = File::open(path).expect("Unable to open file");
//   let mut reader = encoding_rs_io::DecodeReaderBytesBuilder::new().encoding(Some(encoding_rs::WINDOWS_1252)).build(file);
//   let mut buffer = vec![];
//   reader.read_to_end(&mut buffer).expect("Failed to read file");
//   let contents: String = String::from_utf8(buffer).unwrap();

//   contents
// }
