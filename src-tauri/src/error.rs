use core::fmt;

// create the error type that represents all errors possible in our program
#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    Serialization(#[from] serde_json::Error),
}

// implement fmt::Display
impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Error::Io(io_err) => write!(f, "IO Error: {}", io_err),
            Error::Serialization(serde_err) => write!(f, "Serialization Error: {}", serde_err),
        }
    }
}

// implement serde::Serialize
impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
