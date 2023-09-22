!macro customInstall
   SetRegView 64
   WriteRegStr HKCR "*\shell\rubick" "" "open w&ith rubick"
   WriteRegStr HKCR "*\shell\rubick" "Icon" "$INSTDIR\rubick.exe"
   WriteRegStr HKCR "*\shell\rubick\command" "" '"$INSTDIR\rubick.exe" "search" "%1"'
   SetRegView 32
   WriteRegStr HKCR "*\shell\rubick" "" "open w&ith rubick"
   WriteRegStr HKCR "*\shell\rubick" "Icon" "$INSTDIR\rubick.exe"
   WriteRegStr HKCR "*\shell\rubick\command" "" '"$INSTDIR\rubick.exe" "search" "%1"'
!macroend
!macro customUninstall
   DeleteRegKey HKCR "*\shell\rubick"
!macroend