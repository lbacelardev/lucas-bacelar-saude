import { useRef } from 'react';
import { X } from 'lucide-react';
import styles from './PrivacyDialog.module.css';

export function PrivacyDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button className="inline-link" type="button" onClick={() => dialog.current?.showModal()}>
        Privacidade e uso dos dados
      </button>
      <dialog ref={dialog} className={styles.dialog} aria-labelledby="privacy-title">
        <div className={styles.heading}>
          <h2 id="privacy-title">Seus dados, com clareza.</h2>
          <button
            className="icon-button"
            type="button"
            aria-label="Fechar privacidade"
            onClick={() => dialog.current?.close()}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <p>
          O formulário usa nome, cidade, perfil e idades para montar uma solicitação de cotação no
          seu navegador. Não solicitamos CPF, documentos ou dados de saúde.
        </p>
        <h3>Você decide quando compartilhar</h3>
        <p>
          O pedido não é enviado automaticamente. Ao copiar, o texto vai para a área de
          transferência do dispositivo. Ao abrir o WhatsApp, o texto é incluído no endereço de
          abertura da conversa e compartilhado com o serviço. Você confirma o envio no aplicativo.
        </p>
        <h3>Armazenamento e serviços externos</h3>
        <p>
          Esta aplicação não possui banco de dados, cookies de marketing, ferramentas de análise ou
          armazenamento persistente dos campos. Seu navegador pode oferecer preenchimento
          automático. WhatsApp, Instagram e o provedor de hospedagem processam dados conforme suas
          próprias políticas, inclusive registros técnicos de acesso.
        </p>
        <h3>Depois do contato</h3>
        <p>
          Lucas Bacelar usa as informações que você envia para atender sua solicitação. Para dúvidas
          sobre seus dados, fale pelo canal de atendimento ou pelo Instagram @lucasbacelarsaude.
          Evite enviar informações de saúde no pedido inicial.
        </p>
        <p className={styles.note}>
          Os procedimentos de retenção dos dados no atendimento e o provedor de hospedagem serão
          definidos antes do lançamento comercial.
        </p>
        <form method="dialog">
          <button className="button button-dark">Entendi</button>
        </form>
      </dialog>
    </>
  );
}
