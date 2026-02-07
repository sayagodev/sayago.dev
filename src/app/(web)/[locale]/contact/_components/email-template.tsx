interface EmailTemplateProps {
  name: string
  service: string
  budget: string
  email: string
  details?: string
}

export function EmailTemplate({ name, service, budget, email, details }: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#A31D1D",
          padding: "32px 24px",
          textAlign: "center",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <h1
          style={{
            color: "#ffffff",
            margin: 0,
            fontSize: "24px",
            fontWeight: "bold",
            letterSpacing: "0.5px",
          }}
        >
          Nueva Solicitud de Contacto
        </h1>
      </div>

      {/* Content */}
      <div style={{ padding: "32px 24px", backgroundColor: "#ffffff" }}>
        {/* Greeting */}
        <p
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#1a1a1a",
            margin: "0 0 24px 0",
          }}
        >
          Has recibido una nueva solicitud de contacto desde tu portafolio.
        </p>

        {/* Info Cards */}
        <div style={{ marginBottom: "24px" }}>
          {/* Name */}
          <div
            style={{
              backgroundColor: "#f8f8f8",
              padding: "16px",
              borderRadius: "6px",
              marginBottom: "12px",
              borderLeft: "4px solid #A31D1D",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Nombre
            </div>
            <div style={{ fontSize: "18px", color: "#1a1a1a", fontWeight: "600" }}>{name}</div>
          </div>

          {/* Service */}
          <div
            style={{
              backgroundColor: "#f8f8f8",
              padding: "16px",
              borderRadius: "6px",
              marginBottom: "12px",
              borderLeft: "4px solid #A31D1D",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Servicio Solicitado
            </div>
            <div style={{ fontSize: "18px", color: "#1a1a1a", fontWeight: "600" }}>{service}</div>
          </div>

          {/* Budget */}
          <div
            style={{
              backgroundColor: "#f8f8f8",
              padding: "16px",
              borderRadius: "6px",
              marginBottom: "12px",
              borderLeft: "4px solid #A31D1D",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Presupuesto
            </div>
            <div style={{ fontSize: "18px", color: "#1a1a1a", fontWeight: "600" }}>{budget}</div>
          </div>

          {/* Email */}
          <div
            style={{
              backgroundColor: "#f8f8f8",
              padding: "16px",
              borderRadius: "6px",
              marginBottom: "12px",
              borderLeft: "4px solid #A31D1D",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Email de Contacto
            </div>
            <div style={{ fontSize: "18px", color: "#1a1a1a", fontWeight: "600" }}>
              <a href={`mailto:${email}`} style={{ color: "#A31D1D", textDecoration: "none" }}>
                {email}
              </a>
            </div>
          </div>

          {/* Details */}
          {details && details.trim() && (
            <div
              style={{
                backgroundColor: "#f8f8f8",
                padding: "16px",
                borderRadius: "6px",
                marginBottom: "12px",
                borderLeft: "4px solid #A31D1D",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Detalles Adicionales
              </div>
              <div
                style={{
                  fontSize: "15px",
                  color: "#1a1a1a",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                }}
              >
                {details}
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div
          style={{
            marginTop: "32px",
            padding: "20px",
            backgroundColor: "#f0f0f0",
            borderRadius: "6px",
            textAlign: "center",
          }}
        >
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(`Respuesta a tu solicitud: ${service}`)}`}
            style={{
              display: "inline-block",
              backgroundColor: "#A31D1D",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Responder a {name}
          </a>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#f8f8f8",
          padding: "20px 24px",
          textAlign: "center",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "#666",
            margin: 0,
            lineHeight: "1.5",
          }}
        >
          Este email fue generado automáticamente desde tu portafolio.
          <br />
          Fecha:{" "}
          {new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  )
}
