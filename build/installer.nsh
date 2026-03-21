; Script customizado para instalação/desinstalação do Recruter Tech
; Este script é executado durante o processo de instalação NSIS

; Macro executada durante a desinstalação
!macro customUnInstall
  ; Perguntar ao usuário se deseja remover os dados
  ${ifNot} ${Silent}
    MessageBox MB_YESNO|MB_ICONQUESTION "Deseja remover TODOS os dados da aplicação?$\n$\nIsso inclui:$\n- Configurações$\n- Chaves de API$\n- Currículos e sessões salvas$\n- Perguntas personalizadas$\n$\nCaminho: $APPDATA\recruter-tech" IDYES removeData IDNO keepData
    
    removeData:
      ; Remove o diretório de dados do usuário (AppData\Roaming)
      RMDir /r "$APPDATA\recruter-tech"
      MessageBox MB_OK "Todos os dados foram removidos com sucesso!"
      Goto end
    
    keepData:
      MessageBox MB_OK "Os dados foram mantidos em: $APPDATA\recruter-tech$\n$\nVocê pode removê-los manualmente se necessário."
      Goto end
  ${else}
    ; Em modo silencioso, sempre remove os dados
    RMDir /r "$APPDATA\recruter-tech"
  ${endIf}
  
  end:
!macroend
