const DIALOGUE_JA = {
    init: {
        startInit: new Dialogue("データを初期化しています..."),
        progress: new Dialogue(`実行中... $1 / $2 完了!    経過時間 : $3秒`),
        loadFromDB: new Dialogue("[red]データは既にキャッシュされています。 読み込み中...[/]"),
        successLoading: new Dialogue("[green][bold]成功[/][/] データは問題なく読み込まれました!"),
        successInit: new Dialogue(`[green][bold]成功[/][/] データは正常に初期化されました!    かかった時間 : $1秒`),
        fail: new Dialogue("[red][bold]\[エラー\][/][/] 処理は正常に終了できませんでした。"),
    },
    gameCommon: {
        display: {
            turn: new Dialogue("ターン"),
            rollsLeft: new Dialogue("振れる残りの回数"),
            dice: new Dialogue("現在のサイコロ"),
            score: new Dialogue("現在のスコア"),
            upperSum: new Dialogue("上段の合計"),
        },
        guide: new Dialogue("[red]!重要です![/] [bold][bg-selection] rule [/] と打って遊び方を見てください[/]"),
        roleEmpty: new Dialogue(`[red]\[エラー\] 役が指定さていません[/]`),
        invalidRole: new Dialogue(`[red]\[エラー\] 役の名前が違います[/]`),
        noRollsLeft: new Dialogue(`[red]\[エラー\] これ以上振り直せません。役を選んでください。[/]`),
        invalidDiceRoll: new Dialogue(
            `[red]\[エラー\] 不正なサイコロの出目が含まれています。1から6の間に収めてください。[/]`,
        ),
        updateCategory: new Dialogue(`[cyan]\[ログ\][/] 役を選びました: $1 でスコアは $2.`),
        emptyHistory: new Dialogue(`[red]\[エラー\] 履歴は空です`),
        successUndo: new Dialogue(`[cyan]\[ログ\][/] 巻き戻し完了`),
        finished: new Dialogue(`[red]\[エラー\] ゲームはもう終わっています`),
    },
    home: {
        help: new Dialogue(
            `[bold]コマンド一覧[/]
基本操作
* [bg-selection] help [/] : 使い方やモードの簡単な説明を表示します
* [bg-selection] stop [/] : 現在行われているモードなどを終了し、ホームに行きます
* [bg-selection] mode [/] : 現在のモードを表示します。迷ったら使ってください
* [bg-selection] rule [/] : ヨットのルールを表示します
* [bg-selection] clear [/] : スクリーンからログを消します。ログがたまってきたら使ってください。データは消えません
* [bg-selection] about [/] : ヤッツィーについて詳しく
* [bg-selection] version [/] : システムの情報を表示します。例: バージョン、作者、必要なブラウザのバージョンなど

設定
* [bg-selection] japanese [/] : 日本語モード
* [bg-selection] english [/] : 英語モード
* [bg-selection] help on [/] : [italic]"[bg-selection] help [/] で使い方やモードの簡単な説明を表示"[/] を常に表示する
* [bg-selection] help off [/] : [italic]"[bg-selection] help [/] で使い方やモードの簡単な説明を表示"[/] を表示しなくする
* [bg-selection] settings [/] : すべての設定項目を表示します。
* [bg-selection] settings \[設定項目\] [/] : 設定の項目とその値をリスト形式で表示します。
* [bg-selection] setting \[設定項目\] \[新しい値\] [/] : 新しい値で設定を変えます
* [bg-selection] reset [/] : すべての設定を初期化します。

ゲーム
* [bg-selection] teach [/] : [bold]教師モード[/]を始めます
    >> 教師モードとは: あなたが別のアプリでヨットをプレイしているとき、最善の手をお伝えいたします
* [bg-selection] game [/] : 私とヨットをします。
`,
            false,
        ),
        toggleHelp: {
            enable: new Dialogue(`[cyan]\[ログ\] 設定が変更されました[/] ヘルプガイドが有効化されました`),
            disable: new Dialogue(`[cyan]\[ログ\] 設定が変更されました[/] ヘルプガイドが無効化されました`),
        },
        helpGuide: new Dialogue("[bg-selection] help [/] で使い方やモードの簡単な説明を表示"),
        rule: new Dialogue(
            `[bold]ルール[/]
このボットでは昔ながらのヨットのルールを採用しています。
詳しくは<a target="_blank" rel="noopener noreferrer nofollow" href="https://psmgp.com/yahtzee">こちら</a>。
`,
            false,
            false,
        ),
    },
    settings: {
        title: new Dialogue(`[bold]設定[/]`, false),
        invaildKey: new Dialogue(`[red]設定項目がありません[/]`),
        invalidType: new Dialogue(`[red]\[エラー\] "$1" は $2 の値のみを受け付けます`),
        reset: new Dialogue("[cyan]\[ログ\] 設定が変更されました[/] すべての設定がリセットされました"),
        locked: new Dialogue(`[red]"$1" は変えられません[/]`),
        success: new Dialogue(`[cyan]\[ログ\] 設定が変更されました[/] 項目: $1, 新しい値: $2`),
        reject: new Dialogue(`[red]設定の変更に失敗しました。 項目: $1, 新しい値: $2[/]`),
    },
    teach: {
        start: new Dialogue("[cyan]\[ログ\][/] 教師モードスタート!"),
        help: new Dialogue(
            `[bold]説明[/]
このモードでは、あなたは自分でダイスの情報を入力する必要があります。そうするとボットが最適な一手を返します
あなたがやっているヨットの状態と右側に表示されているステータス欄の状態が一致するようにしてください。
このモードはあなたがより強くなるための教師として利用できます。
[bold]くれぐれも他のプラットフォームの規約を破らないようにご注意ください[/]

[bold]コマンド一覧[/]
教師モード
* [bg-selection] help [/] : 説明やコマンドをみます
* [bg-selection] rule [/] : 遊び方を見ます(初めてなら必ず見てください)

基本操作
* [bg-selection] stop [/] : 現在行われているモードなどを終了し、ホームに行きます
* [bg-selection] mode [/] : 現在のモードを表示します。迷ったら使ってください
* [bg-selection] clear [/] : スクリーンからログを消します。ログがたまってきたら使ってください。データは消えません
* [bg-selection] about [/] : ヤッツィーについて詳しく
* [bg-selection] version [/] : システムの情報を表示します。例: バージョン、作者、必要なブラウザのバージョンなど
* 
設定
* [bg-selection] japanese [/] : 日本語モード
* [bg-selection] english [/] : 英語モード
* [bg-selection] help on [/] : [italic]"[bg-selection] help [/] で使い方やモードの簡単な説明を表示"[/] を常に表示する
* [bg-selection] help off [/] : [italic]"[bg-selection] help [/] で使い方やモードの簡単な説明を表示"[/] を表示しなくする
* [bg-selection] settings [/] : すべての設定項目を表示します。
* [bg-selection] settings \[設定項目\] [/] : 設定の項目とその値をリスト形式で表示します。
* [bg-selection] setting \[設定項目\] \[新しい値\] [/] : 新しい値で設定を変えます
* [bg-selection] reset [/] : すべての設定を初期化します。
`,
            false,
        ),
        rule: new Dialogue(
            `[bold]ルール[/]
右側の画面は今のあなたの状態を表しています。スコアや役の埋まり具合、現在のターン数などが表示されます。
この画面の状態があなた側のヨットの状態と完全に一致するようにしてください。

[bold]入力[/]
* [bg-selection] dice [値1] [値2] ... [値5] [/] :  
  あなたが今振ったダイスの目を空白区切りで入力してください。順不同です。

* [bg-selection] set [役の名前] [/] :  
  どの役にするか決めたらこのコマンドで役を記入してください。
  右側の表の左側に書いてある名前が役の名前です。英語ですが、がんばって入力してください
  [bold]もし役の名前にスペースが入る場合(Full HouseやS. Straightなど)、ダブルクオーテーションで囲って一つの文字列としてください。紫になったら成功です (例: "Full House", "S. Straight")[/]
  
* [bg-selecion] undo [/] :
  間違えたときに使うと一つ前に戻れます。
  
[bold]出力[/]
* keep [値1] [値2] ... [値5] :  
  あなたが入力したダイスの目がそのまま返ってきます。
  [bold]キープするべきダイスだけ色が赤色で塗られます[/]

* choose [役の名前] :  
  あなたが選ぶべき役の名前が出ます

[bold]役の名前一覧[/]

上段
* [bg-selection] Ones [/] : エース
* [bg-selection] Twos [/] : デュース
* [bg-selection] Threes [/] : トレイ
* [bg-selection] Fours [/] : フォー
* [bg-selection] Fives [/] : ファイブ
* [bg-selection] Sixes [/] : シックス
下段
* [bg-selection] Chocie [/] : チョイス
* [bg-selection] 4 of a Kind [/] : フォーダイス
* [bg-selection] Full House [/] : フルハウス
* [bg-selection] S. Straight [/] : S.ストレート
* [bg-selection] L. Straight [/] : B.ストレート
* [bg-selection] Yacht [/] : ヨット
`,
        ),
        diceRejectMin: new Dialogue("[red]\[エラー\] 引数が少なすぎます (5個必要です)[/]"),
        diceRejectMax: new Dialogue("[red]\[エラー\] 引数が多すぎます (5個である必要があります)[/]"),
        showKeepCand: new Dialogue(`赤いのをキープしてください  [bold]$1[/]  (期待されるスコア : $2)`),
        showActionCand: new Dialogue(`[bold]$1[/] を選んでください。 得点 : $2, 期待されるスコア : $3`),
        rollPrompt: new Dialogue(`[red]\[エラー\][/] サイコロの目を先に入れてください`),
        finishMsg: new Dialogue("ゲームが終了しました! 頑張ったね! スコア: $1"),
    },
    game: {
        help: new Dialogue(`
[bold]説明[/]
ボットと対戦します

[bold]コマンド一覧[/]
対戦モード
* [bg-selection] help [/] : 説明とコマンドを見ます
* [bg-selection] rule [/] : 遊び方を見ます
* [bg-selection] opponent [/] : ボットの現在の状況(スコア, 役の埋まり具合など)

基本操作
* [bg-selection] stop [/] : やめてホームに戻る
* [bg-selection] mode [/] : 今のモードを表示する。迷子になったら使ってください
* [bg-selection] clear [/] : 画面をクリアします。データは消えません
* [bg-selection] about [/] : ヤッツィーの自己紹介
* [bg-selection] version [/] : システムの情報を表示します (バージョンや作者やブラウザの必要なバージョン要件など)

設定
* [bg-selection] japanese [/] : 日本語にします
* [bg-selection] english [/] : 英語にします
* [bg-selection] help on [/] : [italic]"[bg-selection] help [/] で使い方やモードの簡単な説明を表示"[/] を常に表示する
* [bg-selection] help off [/] : [italic]"[bg-selection] help [/] で使い方やモードの簡単な説明を表示"[/] を表示しなくする
* [bg-selection] settings [/] : すべての設定項目を表示します。
* [bg-selection] settings \[設定項目\] [/] : 設定の項目とその値をリスト形式で表示します。
* [bg-selection] setting \[設定項目\] \[新しい値\] [/] : 新しい値で設定を変えます
* [bg-selection] reset [/] : すべての設定を初期化します。
`),
        start: new Dialogue("[cyan]\[ログ\][/] 対戦モードスタート"),
        rule: new Dialogue(
            `[bold]ルール[/]
右側のスクリーンにはあなたのスコアなどの状態があります。

[bold]入力[/]
* [bg-selection] keep [場所1] ... [場所N] [/] :  
  キープしたいダイスの場所を1から5の値で指定します。順不同です。例えば左から2つ目のダイスをキープしたい場合、[italic]"keep 2"[/]と打ちます。
  [bold]左から何番目かで指定します。[/]

* [bg-selection] keep [/] :
  何も指定しなかった場合、何もキープせずに次のターンに移ります。

* [bg-selection] set [役の名前] [/] :  
  どの役にするか決めたらこのコマンドで役を記入してください。
  右側の表の左側に書いてある名前が役の名前です。英語ですが、がんばって入力してください
  [bold]もし役の名前にスペースが入る場合(Full HouseやS. Straightなど)、ダブルクオーテーションで囲って一つの文字列としてください。紫になったら成功です (例: "Full House", "S. Straight")[/]

* [bg-selection] opponent [/] : 
  ボットの現在のスコアや役の埋まり具合を表示します。

[bold]出力[/]
いろいろ...基本は入力する直前に書かれた五個のダイスがあなたのダイスなのでそれを見ればいいです。

[bold]役の名前一覧[/]

上段
* [bg-selection] Ones [/] : エース
* [bg-selection] Twos [/] : デュース
* [bg-selection] Threes [/] : トレイ
* [bg-selection] Fours [/] : フォー
* [bg-selection] Fives [/] : ファイブ
* [bg-selection] Sixes [/] : シックス
下段
* [bg-selection] Chocie [/] : チョイス
* [bg-selection] 4 of a Kind [/] : フォーダイス
* [bg-selection] Full House [/] : フルハウス
* [bg-selection] S. Straight [/] : S.ストレート
* [bg-selection] L. Straight [/] : B.ストレート
* [bg-selection] Yacht [/] : ヨット
`,
        ),
        keepOutRange: new Dialogue(`[red]\[エラー\][/] キープするダイスの添え字は1から5の間でなくてはなりません`),
        keepAccepted: new Dialogue(`[green]成功[/] ダイスをキープしました`),
        displayDice: new Dialogue("[bold]あなたのダイス[/]: $1 $2 $3 $4 $5"),
        botDiceDisplay: new Dialogue("[bold]ボットのダイス[/]: $1 $2 $3 $4 $5"),
        botKeepPos: new Dialogue("[bold]keep[/] $1"),
        botKeepColored: new Dialogue("ボットは赤い文字のダイスをキープした $1"),
        botFillCategory: new Dialogue("ボットは次の役を選んだ [bold]$1[/]"),
        botCategoryLog: new Dialogue("役: [bold]$1[/], 点数: [bold]$2[/]"),
        good: new Dialogue("[blue]これはいい![/]"),
        okay: new Dialogue("[green]まあまあいいでしょう[/]"),
        soso: new Dialogue("[brightYellow]及第点[/]"),
        bad: new Dialogue("[red]ちょっとなあ...[/]"),
        botTurnEnd: new Dialogue("ターン終了!あなたの番です"),
        botScoreWithBonus: new Dialogue(
            `[bold]スコア[/]
スコア: $1 (ボーナス +35)`,
            false,
        ),
        botScore: new Dialogue(
            `[bold]スコア[/]
スコア: $1`,
            false,
        ),
        botUpperSum: new Dialogue("上段合計: $1 / 63", false),
        botRoleTitle: new Dialogue("[bold]役一覧[/]", false),
        botRoleUsed: new Dialogue("[bg-selection]$1 : $2[/]", false),
        botRole: new Dialogue("$1 : $2", false),

        scoreDisplay: new Dialogue(
            `[bold]結果[/]
あなたのスコア: $1
ボットのスコア: $2`,
            false,
        ),
        win: new Dialogue(
            `<span style="font-weight:bold; font-size: 30px; font-style: italic;">あなたの勝ち!!</span>
おめでとう!`,
            false,
            false,
        ),
        draw: new Dialogue(
            `<span style="font-weight:bold;">引き分け</span>
いいゲームでした`,
            false,
            false,
        ),
        lose: new Dialogue(
            `<span style="font-weight:bold;">あなたの負け...</span>
頑張りましたね`,
            false,
            false,
        ),
    },
    welcome: new Dialogue(
        "[bold]ヨットボットにようこそ![/] ここでは[bold]ヨットを遊べます。[/], さらに[bold]あなたのヨットの先生[/]にもなれます!",
        false,
    ),
    greeting: new Dialogue("こんにちは! [bold]ヤッツィー[/]だよ"),
    systemInfo: new Dialogue(
        `[bold]システム情報[/]
* [yellow]バージョン[/] : ${META.version}
* [yellow]ビルドした日[/] : ${META.build}
* [yellow]作者[/] : <a target="_blank" rel="" href="${META.hpUrl}">${META.author}</a>
* [yellow]ECMAバージョン[/] : ${META.jsRequirement}
    ブラウザ要件
    * [yellow]Chrome[/] : ${META.browserRequirements.chrome}
    * [yellow]Edge[/] : ${META.browserRequirements.edge}
    * [yellow]Firefox[/] : ${META.browserRequirements.firefox}
    * [yellow]Safari[/] : ${META.browserRequirements.safari}
`,
        false,
        false,
    ),
    about: new Dialogue(
        `[bold]自己紹介[/]
ターミナル風のヨットのボットです
英語が厳しかったら、[bg-selection] japanese [/]と打つと日本語を使えます。
`,
        false,
        false,
    ),
    mode: {
        display: new Dialogue("[bold]モード : $1[/]"),
        home: new Dialogue("ホーム (モードを選んで遊ぼう)"),
        teach: new Dialogue("教師モード ([bg-selection] rule [/]と打って遊び方を見てください)"),
        game: new Dialogue("対戦モード ([bg-selection] rule [/]と打って遊び方を見てください)"),
    },
    exit: new Dialogue("現在の処理を止めました"),
    エラー: new Dialogue("ごめんなさい!エラーを検知しました"),
    cmdNotFound: new Dialogue("[red]\[エラー\] そのコマンドは存在しません[/]"),
};
