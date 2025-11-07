$(document).ready(function(){
  if (typeof list === "undefined" || typeof lessonID === "undefined") {
    return; 
  }
/**********************************************
 * 🧠 EPSQuiz - Trắc nghiệm từ vựng
 // Ví dụ 2: hỏi nghĩa tiếng Việt, chọn tiếng Hàn
// EPSQuiz.createQuizFromData(data, { questionKey: "vietnamese", answerKey: "korean" });
// Ví dụ 3: luyện nghe — câu hỏi là audio
// EPSQuiz.createQuizFromData(data, { questionKey: "audio", answerKey: "vietnamese", showAudio: true });
 **********************************************/
var EPSQuiz = (function() {
  let vocabData = [];
  let quizScore = 0;
  let quizTotal = 0;
  let container;
  let audio;
  let questionKey = "korean";
  let answerKey = "vietnamese";
  let showAudio = false;

  // ================== KHỞI TẠO ==================
  function createQuizFromData(data, options = {}) {
    vocabData = data;
    questionKey = options.questionKey || "korean";
    answerKey = options.answerKey || "vietnamese";
    showAudio = options.showAudio || false;

    container = document.getElementById("quizContent") || document.getElementById("vocabBox");
    if (!container) {
      console.error("❌ Không tìm thấy vùng chứa quiz");
      return;
    }
    createQuiz(vocabData);
  }

  // ================== TẠO QUIZ ==================
  function createQuiz(vocab) {
    container.innerHTML = "";
    audio = document.createElement("audio");
    container.appendChild(audio);

    const total = vocab.length >= 10 ? 10 : vocab.length;
    quizTotal = total;
    quizScore = 0;

    const quizData = vocab.sort(() => 0.5 - Math.random()).slice(0, total);

    quizData.forEach((item, index) => {
      const correctAnswer = (item[answerKey] || "").trim();
      const wrongOptions = vocab.filter(v => (v[answerKey] || "").trim() !== correctAnswer);
      const options = [correctAnswer, ...wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3).map(o => (o[answerKey] || "").trim())]
        .sort(() => 0.5 - Math.random());

      // ✅ Câu hỏi
      let questionHTML = "";
      if (showAudio && item.audio) {
        questionHTML = `
          <div class="cau-hoi play-wrapper mb-3">
            <div class="play" key="${item.audio}"></div>
          </div>`;
      } else {
        const qClass =
          questionKey === "vietnamese"
            ? "vietnam"
            : questionKey === "korean"
            ? "korean"
            : "question";
        questionHTML = `<div class="cau-hoi mb-3">
            <span class="${qClass}">${item[questionKey]}</span>
          </div>`;
      }

      // ✅ Đáp án
      const optClass =
        answerKey === "vietnamese"
          ? "vietnam"
          : answerKey === "korean"
          ? "korean"
          : "answer";

      const qDiv = document.createElement("div");
      qDiv.className = "quiz-question";
      qDiv.innerHTML = `<fieldset class="mt-3 pb-5"><legend><strong class="mx-2 text-primary">Câu ${
        index + 1
      }</strong></legend>
        ${questionHTML}
        <div class="options">
          ${options
            .map(
              opt =>
                `<span class="${optClass} text-first" data-answer="${correctAnswer.replace(
                  /"/g,
                  "&quot;"
                )}" onclick="EPSQuiz.checkAnswer(this)">${opt}</span>`
            )
            .join("")}
        </div></fieldset>`;
      container.appendChild(qDiv);
    });

    // ✅ Kết quả
    const resultDiv = document.createElement("div");
    resultDiv.id = "quizResult";
    resultDiv.className = "mt-3 fw-bold text-center";
    container.appendChild(resultDiv);

    // ✅ Nút chơi lại
    const resetWrapper = document.createElement("div");
    resetWrapper.className = "text-center mt-4";

    const resetBtn = document.createElement("button");
    resetBtn.className = "btn btn-user btn-user-dangnhap";
    resetBtn.textContent = "Làm lại";
    resetBtn.style.display = "none";

    resetBtn.addEventListener("click", () => {
      createQuiz(vocabData);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    resetWrapper.appendChild(resetBtn);
    container.appendChild(resetWrapper);

    EPSQuiz.resetBtn = resetBtn;
  }

  // ================== KIỂM TRA ĐÁP ÁN ==================
  function checkAnswer(btn) {
    const correct = (btn.dataset.answer || "").trim(); // ✅ Lấy từ data-answer
    const questionDiv = btn.closest(".quiz-question");
    const options = questionDiv.querySelectorAll(".options span");
    if (questionDiv.classList.contains("answered")) return;
    questionDiv.classList.add("answered");

    // Khóa & tô đáp án
    options.forEach(opt => {
      opt.style.pointerEvents = "none";
      opt.classList.add("disabled");
      if ((opt.textContent || "").trim() === correct) {
        opt.classList.add("correct");
      }
    });

    // Người dùng chọn đúng hay sai
    if ((btn.textContent || "").trim() === correct) {
      btn.classList.add("correct");
      quizScore++;
    } else {
      btn.classList.add("wrong");
    }

    setTimeout(() => {
      questionDiv.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);

    // ✅ Hiển thị kết quả
    const answeredCount = container.querySelectorAll(".quiz-question.answered").length;
    if (answeredCount === quizTotal) {
      const resultDiv = document.getElementById("quizResult");
      resultDiv.className = "alert alert-info text-center mt-3";
      resultDiv.innerHTML = `<i class="far fa-map-marker-question"></i> Bạn đã đúng ${quizScore} / ${quizTotal} câu!`;

      EPSQuiz.resetBtn.style.display = "inline-block";

      setTimeout(() => {
        resultDiv.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }

  // ================== CSS ==================
  const style = document.createElement("style");
  style.textContent = `
    .quiz-question,#quizResult{margin:10px auto;max-width:800px;}
    .options {display: grid;grid-template-columns: repeat(2, 1fr);gap: 10px;margin-top: 5px;}
    .options span {padding: 10px 8px 10px 20px;cursor: pointer;background-color: #f8f8f8;
      transition: background-color 0.2s, transform 0.2s;
      border-radius: 10px;box-shadow: 0 3px #e5e5e5;}
    .correct{background-color:#23AC38!important;color:#fff!important;}
    .wrong{background-color:#EB5757!important;color:#fff!important;}
    .cau-hoi strong{padding-right:10px;}
    @media (max-width: 600px) {
      .options {grid-template-columns: 1fr;gap: 8px;}
      .options span {font-size: 16px;padding: 12px;}
    }
  `;
  document.head.appendChild(style);

  return {
    createQuizFromData,
    checkAnswer,
    resetBtn: null
  };
})();
window.EPSQuiz = EPSQuiz;

// ==================== END EPSQuiz ====================
// ==================== 🎮 Word Match Game (Phiên bản hỗ trợ mảng JSON) ====================
(function ($) {
  $.fn.wordMatchGame = function (options) {
    const settings = $.extend(
      {
        data: null, // ✅ Truyền mảng JSON trực tiếp { korean, vietnamese }
        jsonName: "", // hoặc đường dẫn JSON nếu không truyền mảng
        baseUrl: "",
        correctSound: "https://cdn.jsdelivr.net/gh/hoanglong-85/media@main/correct.mp3",
        wrongSound: "https://cdn.jsdelivr.net/gh/hoanglong-85/media@main/wrong.mp3",
      },
      options
    );

    const $container = this;
    let selectedCards = [];
    let words = [];
    const correctSound = new Audio(settings.correctSound);
    const wrongSound = new Audio(settings.wrongSound);

    // ==================== 💅 CSS chỉ thêm 1 lần ====================
    if (!document.getElementById("word-match-style")) {
      $("<style>", {
        id: "word-match-style",
        text: `
       #word-list-game {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    max-width: 780px;
                    margin: 20px auto;
                }
                .korean-game {
                    color: #007bff; /* xanh */
                    font-family: "Gowun Batang", serif;
                      font-weight: 800;
                      font-style: normal;
                      font-size: 25px;
                  }

                  .vietnamese-game {
                    color: #000; /* đen */
                  }
                .word-item-game {
                    padding: 40px;
                    text-align: center;
                    background: #ddd;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: all 0.3s ease;
                    text-transform: capitalize;
                    font-weight: 600;
                }
                        .selected-game { background: #3498db; color: #fff!important; }
                        .wrong-game    { background: red !important; }
                        .matched-game  { visibility: hidden; } /* Ẩn nhưng giữ bố cục */
                       
                        #restart-button-game {
                    display: none;
                  }
                  #result-game {
                    text-align: center;
                    font-weight: bold;
                    margin-top: 15px;
                  }
                @media (max-width: 768px) {
                 .word-item-game {
                    padding: 40px 15px;}

        `,
      }).appendTo("head");
    }

    // ==================== 🔀 Hỗ trợ logic ====================
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  const generateWordPairs = (source, numPairs) => {
  const pairs = [];
  const selectedWords = shuffle(source).slice(0, numPairs);

  selectedWords.forEach((item, index) => {
    const order = Math.random() > 0.5;

    pairs.push({
      text: order ? item.korean : item.vietnamese,
      id: index,
      lang: order ? "kr" : "vn" // thêm ngôn ngữ vào đây
    });

    pairs.push({
      text: order ? item.vietnamese : item.korean,
      id: index,
      lang: order ? "vn" : "kr" // thẻ còn lại sẽ ngược lại
    });
  });

  return shuffle(pairs);
};


    function startGame() {
      $container.empty();
      const numPairs = words.length >= 6 ? 6 : words.length;
      const pairs = generateWordPairs(words, numPairs);

      const $result = $("<div>").attr("id", "result-game").appendTo($container);
      const $restartButton = $("<div class='text-center mt-4'><button class='btn btn-user btn-user-dangnhap'>Chơi lại</button></div>")
        .attr("id", "restart-button-game")
        .click(startGame)
        .appendTo($container);

      const $wordList = $("<div>").attr("id", "word-list-game").appendTo($container);

      pairs.forEach((pair) => {
        $("<div>")
          .addClass("word-item-game")
          .addClass(pair.lang === "kr" ? "korean-game" : "vietnamese-game")
          .attr("data-id", pair.id)
          .attr("data-lang", pair.lang)
          .text(pair.text)
          .click(function () {
            selectCard($(this));
          })
          .appendTo($wordList);
      });

    }

    function selectCard($el) {
      if ($el.hasClass("matched-game") || selectedCards.includes($el)) return;
      $el.addClass("selected-game");
      selectedCards.push($el);
      if (selectedCards.length === 2) checkMatch();
    }

   function checkMatch() {
  const [$c1, $c2] = selectedCards;
  const isMatch = $c1.data("id") === $c2.data("id") && $c1.data("lang") !== $c2.data("lang");

  if (isMatch) {
    setTimeout(() => {
      correctSound.play();
      $c1.add($c2).addClass("matched-game").removeClass("selected-game").css("visibility", "hidden");
      selectedCards = [];
      checkCompletion();
    }, 300);
  } else {
    setTimeout(() => {
      wrongSound.play();
      $c1.add($c2).addClass("wrong-game");
      setTimeout(() => {
        $c1.add($c2).removeClass("selected-game wrong-game");
        selectedCards = [];
      }, 500);
    }, 300);
  }
}


    function checkCompletion() {
      if ($(".word-item-game:not(.matched-game)", $container).length === 0) {
        $("#result-game", $container).text("Chúc mừng bạn đã hoàn thành trò chơi!");
        $("#restart-button-game", $container).fadeIn();
      }
    }

    // ==================== 📦 Load dữ liệu ====================
    if (settings.data && Array.isArray(settings.data)) {
      // ✅ Dữ liệu đã có sẵn
      words = settings.data.map((item) => ({
        korean: item.korean,
        vietnamese: item.vietnamese,
      }));
      startGame();
    } else if (settings.jsonName) {
      // ✅ Nếu truyền file JSON
      const jsonUrl = settings.baseUrl + settings.jsonName + ".json";
      fetch(jsonUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Lỗi tải JSON: " + res.status);
          return res.json();
        })
        .then((data) => {
          words = data.map((item) => ({
            korean: item.korean,
            vietnamese: item.vietnamese,
          }));
          startGame();
        })
        .catch((err) => {
          console.error(err);
          $container.html("<p class='text-danger text-center'>⚠️ Không thể tải dữ liệu trò chơi!</p>");
        });
    } else {
      $container.html("<p class='text-warning text-center'>⚠️ Thiếu dữ liệu hoặc jsonName!</p>");
    }

    return this;
  };
})(jQuery);


  /**************************************
   * ⚡ Hàm lấy dữ liệu có cache theo ngày
   **************************************/
 /**************************************
 * ⚡ Hàm lấy dữ liệu có cache theo ngày
 **************************************/
let vocabCache = null;
let vocabLoading = false;

async function getVocabDataOnce(lessonID) {
  const today = new Date().toISOString().split('T')[0];

  // ✅ Nếu đã load hôm nay thì trả dữ liệu cache
  if (vocabCache && vocabCache.date === today) return vocabCache.data;

  // ✅ Nếu đang load thì chờ đến khi load xong
  if (vocabLoading) {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (vocabCache) {
          clearInterval(check);
          resolve(vocabCache.data);
        }
      }, 300);
    });
  }

  vocabLoading = true;
  try {
    const url = `https://cdn.jsdelivr.net/gh/duchuy2023/tuvung@main/${lessonID}.json?cb=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Không tải được dữ liệu (${res.status})`);

    const data = await res.json();

    // ✅ Kiểm tra dữ liệu là mảng
    if (!Array.isArray(data)) throw new Error("❌ Dữ liệu JSON không đúng dạng mảng.");

    // ✅ Lưu cache
    vocabCache = { date: today, data: data };
    return data;
  } catch (err) {
    console.error("❌ Lỗi tải dữ liệu:", err);
    throw err;
  } finally {
    vocabLoading = false;
  }
}

  /**************************************
   * 🧩 Hàm tiện ích
   **************************************/
  function shuffleArray(arr) {
    const newArr = arr.slice();
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }

  function getRandomData(data, count) {
    if (!Array.isArray(data)) return [];
    return shuffleArray(data).slice(0, count);
  }

  /**************************************
   * 🧠 Gọi hàm audioPlayer an toàn
   **************************************/
  function initAudioPlayer() {
  if (typeof $.fn.audioPlayer === "function") {
    const options = {};
    if (typeof list !== "undefined") {
      options.list = list;
    }
    $(".play").audioPlayer(options);
  } else {
    console.warn("⚠️ audioPlayer plugin chưa được nạp.");
  }
}

  /**************************************
   * 📦 Xử lý menu click
   **************************************/
async function handleMenuClick(key) {
  const vocabBox = document.getElementById('vocabBox');
  vocabBox.innerHTML = `
    <div class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>`;

  try {
    // Lấy dữ liệu chỉ 1 lần (đã cache)
    const data = await getVocabDataOnce(lessonID);
    let html = "";
    let subset = [];

    switch (key) {
      case "danh-sach":
        html = renderVocab(data);
        break;
      case "trac-nghiem":
        subset = getRandomData(data, 5);
        html = renderTracNghiem(subset);
        break;

      case "luyen-nghe":
        subset = getRandomData(data, 5);
        html = renderLuyenNghe(subset);
        break;

      case "tro-choi":
        subset = getRandomData(data, 6);
        html = renderTroChoi(subset);
        break;

      default:
        html = `<p class="text-muted text-center">Chọn một mục để bắt đầu</p>`;
    }

    vocabBox.innerHTML = html;

    // ✅ Khởi tạo hành vi tương ứng sau khi render
    if (key === "danh-sach") {
      initAudioPlayer();
    } else if (key === "trac-nghiem") {
       renderTracNghiem(getRandomData(data, 10));

    } else if (key === "luyen-nghe") {
      renderLuyenNghe(getRandomData(data, 10));
      initAudioPlayer();
    } else if (key === "tro-choi") {
      renderTroChoi(getRandomData(data, 6));
    }

  } catch (err) {
    console.error(err);
    vocabBox.innerHTML = `<p class="text-danger text-center">❌ Không thể tải dữ liệu</p>`;
  }
}


  /**************************************
   * 🎨 Các hàm render giao diện
   **************************************/
  function renderVocab(data) {
    if (!Array.isArray(data) || data.length === 0)
      return `<p class="text-danger text-center">❌ Không có dữ liệu từ vựng</p>`;
    return `
      <ul class="list-group list-group-flush mb-5">
        ${data.map(item => `
          <li class="list-group-item d-flex justify-content-between align-items-center vocab-item">
            <div>
              <strong class="hanquoc1">${item.korean || ""}</strong>
              <div class="text-first vietnamese">${item.vietnamese || ""}</div>
            </div>
            ${item.audio ? `<div class="play" key="${item.audio}" title="Phát âm"></div>` : ""}
          </li>`).join("")}
      </ul>`;
  }


 function renderTracNghiem(data) {
  const vocabBox = document.getElementById("vocabBox");
  vocabBox.innerHTML = `
    <div class="my-4">
      <div id="quizContent"></div>
    </div>`;
  EPSQuiz.createQuizFromData(data);
}
  
  function renderLuyenNghe(data){
   const vocabBox = document.getElementById("vocabBox");
  vocabBox.innerHTML = `
    <div class="my-4">
      <div id="quizContent"></div>
    </div>`;
  EPSQuiz.createQuizFromData(data, { questionKey: "audio", answerKey: "vietnamese", showAudio: true });
  }
  

  function renderTroChoi(data) {
    const vocabBox = document.getElementById("vocabBox");
      vocabBox.innerHTML = `
        <div class="my-4">
          <div id="game"></div>
        </div>`;
      $("#game").wordMatchGame({
            data: data
          });
  }

  
  
  /****/

  /**************************************
   * 🔘 Sự kiện menu
   **************************************/
  $('#tu-vung .menu-btn').on('click', function () {
    $('#tu-vung .menu-btn').removeClass('active');
    $(this).addClass('active');
    
    handleMenuClick($(this).data('key')); 
    
  });
  // 🚀 Khi load trang: hiển thị "Danh sách"
  handleMenuClick("danh-sach");


});
