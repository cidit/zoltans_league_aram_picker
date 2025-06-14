use serde::Serialize;
use std::{
    collections::{HashMap, HashSet},
    sync::{Arc, Mutex},
};

use actix_web::{dev::Payload, get, middleware, post, route, web, App, HttpRequest, HttpServer, Responder};

#[get("/hello/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

#[derive(Serialize)]
struct Lobby {
    people: HashSet<String>,
}

impl Default for Lobby {
    fn default() -> Self {
        Self {
            people: HashSet::new(),
        }
    }
}

type Lobbies = Mutex<HashMap<String, Lobby>>;

#[post("/join/{lobby_id}")]
async fn join_lobby(lobby_id: web::Path<String>, lobbies: web::Data<Lobbies>) -> impl Responder {
    let mut lobbies = lobbies.lock().unwrap();
    let lobby = lobbies
        .entry(lobby_id.to_string())
        .or_insert(Lobby::default());
    let connection_id = "todo";
    lobby.people.insert(connection_id.to_string());
    format!("unimpl")
}

fn test_ws_todo_errase(req: HttpRequest, ws: Payload) -> impl Responder {
    let res = actix_http::ws::handshake(req);

}

#[get("/lobbies")]
async fn list_lobbies(lobbies: web::Data<Lobbies>) -> impl Responder {
    web::Json(lobbies)
}

#[actix_web::main] // or #[tokio::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let lobbies = web::Data::new(Lobbies::default());

    log::info!("starting HTTP server at http://localhost:8080");
    HttpServer::new(move || {
        App::new()
            .wrap(middleware::NormalizePath::trim())
            .app_data(lobbies.clone())
            .service(greet)
            .service(join_lobby)
            .service(list_lobbies)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
