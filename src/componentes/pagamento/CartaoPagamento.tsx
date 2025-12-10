import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import '../login/login.css';

const cardStyle = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: 'Manrope, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};

export default function CartaoPagamento() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const pagar = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setStatus("");

    try {
      const { data } = await api.post("/criar-pagamento-cartao");
      const { clientSecret } = data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
        },
      });

      if (result.error) {
        setStatus("Erro: " + result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        setStatus("Pagamento aprovado!");
        alert("Compra realizada com sucesso!");
        navigate('/');
      }
    } catch (error: any) {
      setStatus("Erro ao iniciar pagamento: " + (error.response?.data?.mensagem || error.message));
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-form-box" style={{ maxWidth: '500px' }}>
        <h1>Finalizar Compra</h1>

        <div className="login-form" style={{ gap: '20px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Número do cartão</label>
            <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <CardNumberElement options={cardStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Validade</label>
              <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <CardExpiryElement options={cardStyle} />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>CVC</label>
              <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <CardCvcElement options={cardStyle} />
              </div>
            </div>
          </div>

          <button onClick={pagar} disabled={loading} style={{ marginTop: '20px' }}>
            {loading ? "Processando..." : "Pagar Agora"}
          </button>

          {status && <p className="login-error-message" style={{ backgroundColor: status.includes('aprovado') ? 'green' : '#dc3545' }}>{status}</p>}
        </div>
      </div>
    </div>
  );
}