import React from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator
} from "react-native";
import { Block, Text } from "galio-framework";
import RecipeWidget from "../components/RecipeWidget";
import { getAuth } from "firebase/auth";
import DailyCalorieRequirements from "./DailyCalorieRequirements";
import { Card } from "../components";
import { nutriTheme } from "../constants";
import MacroNutrients from "./MacroNutrients";
import CuisineDropdown from "../components/Dropdown";
import { Ionicons } from "@expo/vector-icons";
import { savePreferences, saveMealPlan } from "../database/setFunctions";
import Deviations from "./Deviations";

class MealPlanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      userPreferences: {
        Cuisine: [],
        Diet: "",
        Calories: "",
        Protein: "",
        Fat: "",
        Carbohydrates: "",
        Exclude: ""
      },
      activityLevel: null,
      userData: {},
      perfectWeight: null,
      differenceFromPerfectWeight: null,
      health: "",
      recommendedGoal: "",
      selectedGoal: "",
      dailyCaloryRequirements: [],
      macroNutrients: [],
      isPlanGeneratedWithOpenAI: false,
      isPlanGeneratedWithGemini: false,
      mealPlanImages: {},
      mealPlan: {},
      requestFailed: false,
      isLoading: false,
      isDailyCaloryLoading: true,
      currentPage: 0,
      itemsPerPage: 5
    };
  }

  // Извиква се при първоначално зареждане на компонента.
  componentDidMount() {
    // Извлича се аутентикационния обект.
    const auth = getAuth();
    // Създава се проследимост към промените на аутентикационния статус на потребителя.
    this.unsubscribe = auth.onAuthStateChanged((user) => {
      // Проверява дали има активен потребител.
      if (user) {
        // Актуализира се състоянието с текущия потребител.
        this.setState({ currentUser: user });
      } else {
        // В случай на липса на потребител, състоянието се актуализира до нулево.
        this.setState({ currentUser: null });
      }
    });
  }

  // Извиква се след всяко обновяване на компонента.
  componentDidUpdate(prevProps, prevState) {
    // Проверява дали предишното състояние на текущия потребител се различава от текущото и дали има активен потребител.
    if (
      prevState.currentUser !== this.state.currentUser &&
      this.state.currentUser
    ) {
      // Ако условието е изпълнено, се извиква метод за зареждане на данни.
      this.fetchData();
    }

    if (prevState.userPreferences !== this.state.userPreferences) {
      savePreferences(
        this.state.currentUser.uid,
        Number(this.state.userPreferences.Calories),
        {
          name: this.state.userPreferences.Diet,
          protein: this.state.userPreferences.Protein,
          fat: this.state.userPreferences.Fat,
          carbs: this.state.userPreferences.Carbohydrates
        }
      );
    }

    if (
      prevState.mealPlan !== this.state.mealPlan &&
      prevState.mealPlanImages !== this.state.mealPlanImages
    ) {
      const aiUsed = this.state.isPlanGeneratedWithOpenAI
        ? "mealPlanOpenAI"
        : "mealPlanGemini";

      saveMealPlan(
        this.state.currentUser.uid,
        aiUsed,
        this.state.mealPlan,
        this.state.mealPlanImages
      );
    }
  }

  // Извиква се преди изтриване на компонента.
  componentWillUnmount() {
    // Прекъсва проследяването на промените в аутентикационния статус на потребителя.
    this.unsubscribe();
  }

  /**
   * Извлича данни от външен източник чрез асинхронна заявка и актуализира състоянието на компонента с получените данни.
   */
  fetchData = async () => {
    try {
      // Извличане на уникалния идентификационен номер на текущия потребител.
      const uid = this.state.currentUser.uid;
      // Генериране на текущата дата във формат ISO и извличане на само датата.
      const date = new Date().toISOString().slice(0, 10);
      // Изпращане на POST заявка към NutriFit API със зададени хедъри и body на заявката.
      const response = await fetch(
        "https://nutri-api.noit.eu/weightStatsAndMealPlanner",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "349f35fa-fafc-41b9-89ed-ff19addc3494"
          },
          body: JSON.stringify({
            uid: uid,
            date: date
          })
        }
      );

      // Проверка за успешен отговор от сървъра.
      if (!response.ok) {
        // В случай на неуспешна заявка, генерира се грешка.
        throw new Error("Failed to fetch weight stats");
      }

      // Извличане на данните от отговора в JSON формат.
      const weightStatsData = await response.json();

      // Актуализиране на състоянието с получените данни.
      this.setState({
        userData: {
          gender: weightStatsData.userDataSaveable.gender,
          goal: weightStatsData.userDataSaveable.goal,
          age: weightStatsData.userDataSaveable.age,
          height: weightStatsData.userDataSaveable.height,
          waist: weightStatsData.userDataSaveable.waist,
          neck: weightStatsData.userDataSaveable.neck,
          hip: weightStatsData.userDataSaveable.hip,
          weight: weightStatsData.userDataSaveable.weight
        },
        perfectWeight: weightStatsData.perfectWeight,
        differenceFromPerfectWeight: {
          difference:
            weightStatsData?.differenceFromPerfectWeight?.difference || 0,
          isUnderOrAbove:
            weightStatsData?.differenceFromPerfectWeight?.isUnderOrAbove || ""
        },
        health: weightStatsData.bmiIndex.health,
        recommendedGoal: this.calculateRecommendedGoal(
          weightStatsData.differenceFromPerfectWeight
        ),
        dailyCaloryRequirements: weightStatsData.dailyCaloryRequirements,
        macroNutrients: weightStatsData.macroNutrientsData,
        isDailyCaloryLoading: false
      });
    } catch (error) {
      // В случай на грешка при извличането на данни, извеждане на съобщение за грешка в конзолата.
      console.error("Error fetching weight stats:", error);
    }
  };

  /**
   * Изчислява препоръчителната цел за тегло на потребителя.
   * @param {Object} differenceFromPerfectWeight - Обект, съдържащ разликата от идеалното тегло и информация дали потребителят е под или над нормата.
   * @returns {string} - Препоръчителната цел за тегло, в килограми.
   * @throws {Error} - Грешка при невъзможност за изчисляване на препоръчителната цел.
   */
  calculateRecommendedGoal = (differenceFromPerfectWeight) => {
    const difference = differenceFromPerfectWeight.difference;
    const underOrAbove = differenceFromPerfectWeight.isUnderOrAbove;

    let recommendedGoal;

    if (Math.abs(difference) < 2) {
      recommendedGoal = "Запазите";
    } else if (underOrAbove === "under" && Math.abs(difference) >= 2) {
      recommendedGoal = "Качвате";
    } else if (underOrAbove === "above" && Math.abs(difference) >= 2) {
      recommendedGoal = "Сваляте";
    }

    return recommendedGoal + " (кг.)";
  };

  /**
   * Обработва входните данни от потребителя.
   * @param {string} key - Ключът на входните данни.
   * @param {string|number} value - Стойността на входните данни.
   */
  handleInputChange = (key, value) => {
    if (
      key === "Calories" ||
      key === "Protein" ||
      key === "Fat" ||
      key === "Carbohydrates"
    ) {
      if (!isNaN(value)) {
        this.setState((prevState) => ({
          userPreferences: {
            ...prevState.userPreferences,
            [key]: value
          }
        }));
      }
    } else {
      this.setState((prevState) => ({
        userPreferences: {
          ...prevState.userPreferences,
          [key]: value
        }
      }));
    }
  };

  /**
   * Обработва избора на цел от страна на потребителя.
   * @param {string} goal - Избраната цел от потребителя.
   */
  handleGoalSelect = (goal) => {
    // Актуализира се състоянието с избраната цел.
    this.setState({ selectedGoal: goal });
  };

  /**
   * Обработва избора на калории от потребителя.
   * @param {number} calories - Избраните калории от потребителя.
   */
  handleSelectedCalories = (calories) => {
    // Актуализира се състоянието с избраните калории.
    this.setState((prevState) => ({
      userPreferences: {
        ...prevState.userPreferences,
        Calories: calories
      }
    }));
  };

  /**
   * Обработва избора на диета от страна на потребителя.
   * @param {number} protein - Избраното количество протеини от потребителя.
   * @param {number} fat - Избраното количество мазнини от потребителя.
   * @param {number} carbs - Избраното количество въглехидрати от потребителя.
   * @param {string} dietName - Името на избраната диета от потребителя.
   */
  handleSelectedDiet = (protein, fat, carbs, dietName) => {
    // Актуализира се състоянието с избраната диета.
    this.setState((prevState) => ({
      userPreferences: {
        ...prevState.userPreferences,
        Protein: protein,
        Fat: fat,
        Carbohydrates: carbs,
        Diet: dietName
      }
    }));
  };

  handleSelectedCuisine = (selectedCuisines) => {
    this.setState((prevState) => ({
      userPreferences: {
        ...prevState.userPreferences,
        Cuisine: selectedCuisines // Update selected cuisines in state
      }
    }));
  };

  render() {
    console.log("userPreferences: ", this.state.userPreferences);

    // Обект, който съдържа преводите на кухните от английски на български.
    const cuisineTranslation = {
      Italian: "Италианска",
      Bulgarian: "Българска",
      Spanish: "Испанска",
      French: "Френска"
    };

    /**
     * Превежда кухнята от английски на български.
     * @param {string|string[]} englishCuisine - Кухнята или кухните, които трябва да бъдат преведени.
     * @returns {string|string[]} - Преведената кухня или кухните.
     */
    translateCuisine = (englishCuisine) => {
      if (Array.isArray(englishCuisine)) {
        return englishCuisine.map(
          (cuisine) => cuisineTranslation[cuisine] || cuisine
        );
      } else {
        return cuisineTranslation[englishCuisine] || englishCuisine;
      }
    };

    // Превеждане на предпочитаната кухня на потребителя и извеждане на преведената информация в конзолата.
    const translatedCuisine = translateCuisine(
      this.state.userPreferences.Cuisine
    );

    let promptCuisine;

    // Генериране на фразата за предпочитаната кухня на потребителя.
    if (Array.isArray(translatedCuisine)) {
      promptCuisine = translatedCuisine.join(", ");
    } else {
      promptCuisine = translatedCuisine;
    }
    console.log("TRANSLATED --->", promptCuisine);
    let cuisinePhrase;

    // Генериране на фразата за предпочитаната кухня на потребителя.
    if (Array.isArray(this.state.userPreferences.Cuisine)) {
      if (this.state.userPreferences.Cuisine.length === 0) {
        cuisinePhrase = "всяка";
      } else if (this.state.userPreferences.Cuisine.length === 1) {
        cuisinePhrase = translatedCuisine[0];
      } else {
        cuisinePhrase = "следните";
      }
    } else {
      cuisinePhrase = this.state.userPreferences.Cuisine;
    }
    console.log("cuisinePhrase --->", cuisinePhrase);

    // промпт за OpenAI и Gemini.
    const prompt = `Вие сте опитен диетолог, който наблюдава пациентите да консумират само ядлива и традиционна храна от
      ${cuisinePhrase} кухня/кухни (${promptCuisine}). Фокусирайте се върху създаването на ТОЧЕН, разнообразен и вкусен дневен хранителен план, съставен от следните ограничения: калории (${
      this.state.userPreferences.Calories
    }), протеин (${this.state.userPreferences.Protein}), мазнини (${
      this.state.userPreferences.Fat
    }) и въглехидрати (${
      this.state.userPreferences.Carbohydrates
    }). Никога не превишавайте или намалявайте предоставените лимити и се УВЕРЕТЕ, че калориите и мазнините ВИНАГИ са същите като предоставените лимити.
        Осигурете точността на количествата, като същевременно се придържате към лимитите.
        Уверете се, че предоставените от вас хранения се различават от тези, които сте предоставили в предишни заявки. Давай винаги нови и вкусни храни, така че винаги да се създаде уникално и разнообразно меню.
        Експортирайте в JSON ТОЧНО КАТО ПРЕДОСТАВЕНАТА СТРУКТУРА в съдържанието на този заявка, без да добавяте 'json' ключова дума с обратни кавички.
        Отговорът трябва да бъде чист JSON, нищо друго. Това означава, че вашият отговор не трябва да започва с 'json*backticks*{data}*backticks*' или '*backticks*{data}*backticks*'.
        Създайте ми дневно меню с ниско съдържание на мазнини, включващо едно ястие за закуска, три за обяд (третото трябва да е десерт) и две за вечеря (второто да бъде десерт).
        Менюто трябва стриктно да спазва следните лимити: да съдържа ${
          this.state.userPreferences.Calories
        } калории, ${this.state.userPreferences.Protein} грама протеин, ${
      this.state.userPreferences.Fat
    } грама мазнини и ${
      this.state.userPreferences.Carbohydrates
    } грама въглехидрати.
        НЕ Предоставяйте храни, които накрая имат значително по-малко количество калории, въглехидрати, протеин и мазнини в сравнение с посочените общи лимити (${
          this.state.userPreferences.Calories
        } калории, ${this.state.userPreferences.Protein} грама протеин, ${
      this.state.userPreferences.Fat
    } грама мазнини и ${
      this.state.userPreferences.Carbohydrates
    } грама въглехидрати) и НИКОГА, АБСОЛЮТНО НИКОГА не давай хранителен план, чийто сумирани стойности са с отклонение от лимитите на потребителя - 100 калории, 10 грама протеини, 20 грама въглехидрати, 10 грама мазнини. ДАВАЙ ВСЕКИ ПЪТ РАЗЛИЧНИ храни, а не еднакви или измислени рецепти.
        Включвай само съществуващи в реалния свят храни в хранителния план. Предоставете точни мерки и точни стойности за калории, протеин, въглехидрати и мазнини за закуска, обяд, вечеря и общо. Включете само реалистични храни за консумация.
        Подсигури рецепти за приготвянето на храните и нужните продукти(съставки) към всяко едно ястие. Направи рецептите и съставките, така че да се получи накрая точното количество, което ще се яде, не повече от това.
        Имената на храните трябва да бъдат адекватно преведени и написани на български език и да са реални ястия за консумация.
        ${
          this.state.userPreferences.Exclude &&
          `Добави всички останали условия към менюто, но се увери, че избягваш стриктно да включваш следните елементи в менюто на храните: ${this.state.userPreferences.Exclude}.
          Съобрази се с начина на приготвяне и рецептите вече като имаш в предвид какво НЕ ТРЯБВА да се включва.`
        }
        Имената на храните трябва да са адекватно преведени и написани, така че да са съществуващи храни.
        Форматирай общата информацията за калориите, протеина, въглехидратите и мазнините по следния начин И ВНИМАВАЙ ТЯ ДА НЕ Е РАЗЛИЧНА ОТ ОБЩАТА СТОЙНОСТ НА КАЛОРИИТЕ, ВЪГЛЕХИДРАТИТЕ, ПРОТЕИНА И МАЗНИНИТЕ НА ЯСТИЯТА: 'totals: {'calories': number,'protein': number,'fat': number,'carbohydrates': number,'grams':number}'.
        Форматирай ЦЯЛАТА информация във валиден JSON точно така:
        "'breakfast':{
            'main':{'name':'string','totals':{'calories':number,'protein':number,'fat':number,'carbohydrates':number,'grams':number}, 'ingredients':['quantity ingredient','quantity ingredient','quantity ingredient','quantity ingredient','quantity ingredient'...], 'instructions':['1.string','2.string','3.string','4.string'...], 'recipeQuantity': number (in grams)}
          },
          'lunch':{
            'appetizer':{'name':'string','totals':{'calories':number,'protein':number,'fat':number,'carbohydrates':number,'grams':number}, 'ingredients':['quantity ingredient','quantity ingredient','quantity ingredient','quantity ingredient','quantity ingredient'...], 'instructions':['1.string','2.string','3.string','4.string'...], 'recipeQuantity': number (in grams)},
            'main':{'name':'string','totals':{'calories':number,'protein':number,'fat':number,'carbohydrates':number,'grams':number}, 'ingredients':['quantity ingredient','quantity ingredient','quantity ingredient','quantity ingredient','quantity ingredient'...], 'instructions':['1.string','2.string','3.string','4.string'...], 'recipeQuantity': number (in grams)},
            'dessert':{'name':'string','totals':{'calories':number,'protein':number,'fat':number,'carbohydrates':number,'grams':number}, 'ingredients':['quantity ingredient','quantity ingredient','quantity ingredient','quantity ingredient','quantity ingredient'...], 'instructions':['1.string','2.string','3.string','4.string'...], 'recipeQuantity': number (in grams)}
          },
          'dinner':{
            'main':{'name':'string','totals':{'calories':number,'protein':number,'fat':number,'carbohydrates':number,'grams':number}, 'ingredients':['quantity ingredient','quantity ingredient','quantity ingredient','quantity ingredient','quantity ingredient'...], 'instructions':['1.string','2.string','3.string','4.string'...], 'recipeQuantity': number (in grams)},
            'dessert':{'name':'string','totals':{'calories':number,'protein':number,'fat':number,'carbohydrates':number,'grams':number}, 'ingredients':['quantity ingredient','quantity ingredient','quantity ingredient','quantity ingredient','quantity ingredient'...], 'instructions':['1.string','2.string','3.string','4.string'...], 'recipeQuantity': number (in grams)}
          }`;

    /**
     * Проверява общите стойности в даден обект или масив от обекти.
     * @param {Object|Object[]} obj - Обект или масив от обекти, които трябва да бъдат проверени.
     * @throws {Error} - Генерира се грешка, ако стойностите в обекта не са числа.
     */
    checkTotals = (obj) => {
      if (Array.isArray(obj)) {
        obj.forEach((item) => checkTotals(item));
      } else if (typeof obj === "object" && obj !== null) {
        if (obj.hasOwnProperty("totals")) {
          for (let key in obj.totals) {
            if (typeof obj.totals[key] !== "number") {
              throw new Error(
                `Invalid value for ${key} in totals: Expected a number`
              );
            }
          }
        }
        // Рекурсивно проверява вложените обекти
        for (let key in obj) {
          checkTotals(obj[key]);
        }
      }
    };

    isValidJson = (jsonObject) => {
      return (
        jsonObject &&
        jsonObject.breakfast &&
        jsonObject.lunch &&
        jsonObject.dinner
      );
    };
    /**
     * Генерира план за хранене с помощта на OpenAI модел.
     */
    generatePlanWithOpenAI = async () => {
      try {
        // Актуализира състоянието, за да покаже, че планът се генерира с OpenAI модела и че заявката е в процес на обработка.
        this.setState({
          isPlanGeneratedWithOpenAI: true,
          isPlanGeneratedWithBgGPT: false,
          requestFailed: false,
          isLoading: true
        });
        console.log("fetching openai");
        // Key
        const secret = process.env.SECRET_OPEN;
        // Изпраща заявка към OpenAI API за генериране на план за хранене.
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${secret}`
            },
            body: JSON.stringify({
              model: "gpt-4-0125-preview",
              messages: [
                {
                  role: "user",
                  content: prompt
                }
              ]
            })
          }
        );

        if (!response.ok) {
          // Актуализира състоянието в случай на грешка при заявката към OpenAI API.
          this.setState({
            requestFailed: true
          });
          throw new Error("Failed to generate meal plan");
        }
        console.log("res: ", response);
        const responseData = await response.json();
        const responseJson = responseData.choices[0].message.content;
        // Декодира и обработва отговора от OpenAI API.
        const unescapedData = responseJson;
        const escapedData = decodeURIComponent(unescapedData);
        console.log("escapedData: ", escapedData);

        const data = JSON.parse(escapedData);

        if (!isValidJson(data)) {
          throw new Error("Invalid JSON structure");
        }

        console.log("OPENAI: ", data);

        // Филтрира обекта с данни за плана за хранене, като премахва стойностите за общи стойности (totals).
        const filteredArr = Object.fromEntries(
          Object.entries(data).filter(([key]) => key !== "totals")
        );

        // Обект, който ще съдържа връзките към изображенията на ястията от плана за хранене.
        const mealPlanImagesData = {
          breakfast: {
            main: ""
          },
          lunch: {
            appetizer: "",
            main: "",
            dessert: ""
          },
          dinner: {
            main: "",
            dessert: ""
          }
        };

        // Обхождане на всяко ястие от плана и извършване на отделна заявка за генериране на изображение.
        for (const mealKey of Object.keys(filteredArr)) {
          const mealAppetizer = filteredArr[mealKey].appetizer;
          const mealMain = filteredArr[mealKey].main;
          const mealDessert = filteredArr[mealKey].dessert;

          // Функция за извличане на изображение от името на ястието.
          async function fetchImage(name) {
            try {
              let response = await fetch(
                `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyBGskRKof9dkcoXtReamm4-h7UorF1G7yM&cx=10030740e88c842af&q=${encodeURIComponent(
                  name
                )}&searchType=image`
              );
              if (response.status === 429) {
                let response = await fetch(
                  `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyBpwC_IdPQ2u-16x_9QwoqJDu-zMhuFKxs&cx=258e213112b4b4492&q=${encodeURIComponent(
                    name
                  )}&searchType=image`
                );
                return response;
              } else {
                return response;
              }
            } catch (error) {
              console.error("Error fetching image:", error);
              return null;
            }
          }

          // Извличане на изображенията за апетитите, основните ястия и десертите.
          const imageAppetizer =
            mealKey === "lunch" ? await fetchImage(mealAppetizer.name) : null;
          const imageMain = await fetchImage(mealMain.name);
          const imageDessert =
            mealKey === "lunch" || mealKey === "dinner"
              ? await fetchImage(mealDessert.name)
              : null;

          // Обработка на отговорите за изображенията и актуализиране на състоянието с връзките към изображенията на ястията.
          const imageAppetizerResponseData =
            imageAppetizer !== null ? await imageAppetizer.json() : null;
          const imageMainResponseData = await imageMain.json();
          const imageDessertResponseData =
            imageDessert !== null ? await imageDessert.json() : null;

          if (
            imageAppetizerResponseData !== null &&
            imageAppetizerResponseData?.items?.[0]?.link
          ) {
            mealPlanImagesData[mealKey].appetizer =
              imageAppetizerResponseData.items[0].link;
          }

          if (imageMainResponseData?.items?.[0]?.link) {
            mealPlanImagesData[mealKey].main =
              imageMainResponseData.items[0].link;
          }

          if (
            imageDessertResponseData !== null &&
            imageDessertResponseData?.items?.[0]?.link
          ) {
            mealPlanImagesData[mealKey].dessert =
              imageDessertResponseData.items[0].link;
          }
        }

        console.log("mealPlanImagesData:", mealPlanImagesData);

        // Актуализира състоянието с връзките към изображенията на ястията и плана за хранене, които са били генерирани с OpenAI модела.
        this.setState({
          mealPlanImages: mealPlanImagesData,
          mealPlan: data,
          isLoading: false
        });
      } catch (error) {
        // Актуализира състоянието в случай на грешка при генериране на плана за хранене.
        this.setState({
          requestFailed: true,
          isLoading: false
        });
        console.error("Error generating meal plan:", error);
      }
    };

    /**
     * Генерира план за хранене с помощта на Gemini модел.
     */
    generatePlanWithGemini = async () => {
      try {
        // Актуализира състоянието, за да покаже, че планът се генерира с Gemini модела и че заявката е в процес на обработка.
        this.setState({
          isPlanGeneratedWithOpenAI: false,
          isPlanGeneratedWithGemini: true,
          requestFailed: false,
          isLoading: true
        });
        console.log("PROMPT --->", prompt);
        console.log("fetching gemini");
        // Изпраща заявка към NutriFit API за генериране на план за хранене с Gemini модела.
        const response = await fetch(
          "https://nutri-api.noit.eu/geminiGenerateResponse",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "349f35fa-fafc-41b9-89ed-ff19addc3494"
            },
            body: JSON.stringify({ text: prompt })
          }
        );

        const responseData = await response.json();
        const responseJson = responseData.aiResponse;
        console.log("Response from backend:", responseJson);

        const stringToRepair = responseJson
          .replace(/^```json([\s\S]*?)```$/, "$1")
          .replace(/^```JSON([\s\S]*?)```$/, "$1")
          .replace(/^'|'$/g, "")
          .trim();
        let jsonObject;
        try {
          console.log("stringToRepair: ", stringToRepair);
          jsonObject = JSON.parse(stringToRepair);
          checkTotals(jsonObject);
          console.log("jsonObject11111: ", jsonObject);
        } catch (parseError) {
          throw new Error("Invalid JSON response from the server");
        }

        if (!isValidJson(jsonObject)) {
          throw new Error("Invalid JSON structure");
        }

        console.log("jsonObject: ", jsonObject);
        // Обект, който ще съдържа връзките към изображенията на ястията от плана за хранене, генериран с Gemini модела.
        const mealPlanImagesData = {
          breakfast: {
            main: ""
          },
          lunch: {
            appetizer: "",
            main: "",
            dessert: ""
          },
          dinner: {
            main: "",
            dessert: ""
          }
        };

        // Обхождане на всяко ястие от плана и извършване на отделна заявка за генериране на изображение.
        for (const mealKey of Object.keys(jsonObject)) {
          if (mealKey !== "totals") {
            const mealAppetizer = jsonObject[mealKey].appetizer;
            const mealMain = jsonObject[mealKey].main;
            const mealDessert = jsonObject[mealKey].dessert;

            // Функция за извличане на изображение от името на ястието.
            async function fetchImage(name) {
              try {
                let response = await fetch(
                  `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw&cx=10030740e88c842af&q=${encodeURIComponent(
                    name
                  )}&searchType=image`
                );
                if (response.status === 429) {
                  let response = await fetch(
                    `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyBQMvBehFDpwqhNc9_q-lIfPh8O2xdQ1Mc&cx=258e213112b4b4492&q=${encodeURIComponent(
                      name
                    )}&searchType=image`
                  );
                  return response;
                } else {
                  return response;
                }
              } catch (error) {
                console.error("Error fetching image:", error);
                return null;
              }
            }

            // Извличане на изображенията за апетитите, основните ястия и десертите.
            const imageAppetizer =
              mealKey === "lunch" ? await fetchImage(mealAppetizer.name) : null;
            const imageMain = await fetchImage(mealMain.name);
            const imageDessert =
              mealKey === "lunch" || mealKey === "dinner"
                ? await fetchImage(mealDessert.name)
                : null;

            // Обработка на отговорите за изображенията и актуализиране на състоянието с връзките към изображенията на ястията.
            const imageAppetizerResponseData =
              imageAppetizer !== null ? await imageAppetizer.json() : null;
            const imageMainResponseData = await imageMain.json();
            const imageDessertResponseData =
              imageDessert !== null ? await imageDessert.json() : null;

            // console.log("imageDessert: ", imageDessert, mealKey);

            if (
              imageAppetizerResponseData !== null &&
              imageAppetizerResponseData?.items?.[0]?.link
            ) {
              mealPlanImagesData[mealKey].appetizer =
                imageAppetizerResponseData.items[0].link;
            }

            if (imageMainResponseData?.items?.[0]?.link) {
              mealPlanImagesData[mealKey].main =
                imageMainResponseData.items[0].link;
            }

            if (
              imageDessertResponseData !== null &&
              imageDessertResponseData?.items?.[0]?.link
            ) {
              mealPlanImagesData[mealKey].dessert =
                imageDessertResponseData.items[0].link;
            }
          }
        }

        // Актуализира състоянието с връзките към изображенията на ястията и плана за хранене, които са били генерирани с Gemini модела.
        this.setState({
          mealPlanImages: mealPlanImagesData,
          mealPlan: jsonObject,
          isLoading: false
        });
      } catch (error) {
        // Актуализира състоянието в случай на грешка при генериране на плана за хранене.
        this.setState({
          requestFailed: true,
          isLoading: false
        });
        console.error("Error generating meal plan:", error);
      }
    };

    /**
     * Отива към предходната страница в навигацията.
     */
    goToPreviousPage = () => {
      this.setState((prevState) => ({
        currentPage: prevState.currentPage - 1
      }));
    };

    /**
     * Отива към следващата страница в навигацията.
     */
    goToNextPage = () => {
      this.setState((prevState) => ({
        currentPage: prevState.currentPage + 1
      }));
    };

    /**
     * Превежда типа на ястието от английски на български.
     * @param {string} mealType - Типа на ястието на английски.
     * @returns {string} - Преведеният тип на ястието на български.
     */
    translateMealType = (mealType) => {
      switch (mealType) {
        case "breakfast":
          return "Закуска";
        case "lunch":
          return "Обяд";
        case "dinner":
          return "Вечеря";
        default:
          return mealType; // Връща оригиналния тип на ястието, ако преводът не е наличен
      }
    };

    const {
      isLoading,
      isDailyCaloryLoading,
      requestFailed,
      userPreferences,
      activityLevel,
      dailyCaloryRequirements,
      macroNutrients,
      currentPage,
      itemsPerPage,
      isPlanGeneratedWithOpenAI
    } = this.state;

    const levels = [1, 2, 3, 4, 5, 6];

    console.log("activityLevel: ", activityLevel);

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Card>
            <Text style={styles.title}>Изберете ниво на натовареност:</Text>
            <View style={styles.buttonContainer}>
              {levels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.button,
                    activityLevel === level ? styles.activeButton : null
                  ]}
                  onPress={() => this.setState({ activityLevel: level })}
                >
                  <Text style={styles.buttonText}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
          {activityLevel && (
            <Card style={{ marginBottom: 20 }}>
              <Text style={styles.title}>
                Изберете желаната от вас цел и съответните калории, които трябва
                да приемате на ден според желания резултат:
              </Text>
              {isDailyCaloryLoading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              ) : (
                <Block>
                  <DailyCalorieRequirements
                    dailyCaloryRequirementsArray={dailyCaloryRequirements}
                    activityLevel={activityLevel}
                    onGoalSelect={this.handleGoalSelect}
                    onCaloriesSelect={this.handleSelectedCalories}
                  />
                  {this.state.selectedGoal !== "" && (
                    <MacroNutrients
                      macroNutrientsArray={macroNutrients}
                      activityLevel={activityLevel}
                      selectedGoal={this.state.selectedGoal}
                      onDietSelect={this.handleSelectedDiet}
                    />
                  )}
                </Block>
              )}
            </Card>
          )}
          {userPreferences.Diet && (
            <Card style={{ marginBottom: 20, marginTop: -5 }}>
              <Text style={styles.title} size={20}>
                Създайте хранителен план с NutriFit
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Калории"
                  value={userPreferences.Calories}
                  onChangeText={(text) =>
                    this.handleInputChange("Calories", text)
                  }
                  style={styles.input}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="Протеини"
                  value={userPreferences.Protein}
                  onChangeText={(text) =>
                    this.handleInputChange("Protein", text)
                  }
                  style={styles.input}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="Мазнини"
                  value={userPreferences.Fat}
                  onChangeText={(text) => this.handleInputChange("Fat", text)}
                  style={styles.input}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="Въглехидрати"
                  value={userPreferences.Carbohydrates}
                  onChangeText={(text) =>
                    this.handleInputChange("Carbohydrates", text)
                  }
                  style={styles.input}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="Какво да не се включва"
                  value={userPreferences.Exclude}
                  onChangeText={(text) =>
                    this.handleInputChange("Exclude", text)
                  }
                  style={styles.input}
                />
                <CuisineDropdown onCuisineSelect={this.handleSelectedCuisine} />
              </View>

              {isLoading && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              )}
              {requestFailed && (
                <Text style={styles.title} size={20}>
                  Не намерихме подходящ хранителен план за вас. Опитайте отново.
                </Text>
              )}
              <View style={[styles.buttonContainer, { gap: 10 }]}>
                <TouchableOpacity
                  style={[styles.button, { marginHorizontal: 0 }]}
                  onPress={generatePlanWithOpenAI}
                >
                  <Text style={styles.buttonText}>
                    Създайте хранителен план с OpenAI
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { marginHorizontal: 0 }]}
                  onPress={generatePlanWithGemini}
                >
                  <Text style={styles.buttonText}>
                    Създайте хранителен план с Gemini
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
          {Object.keys(this.state.mealPlan).map((mealType, index) => {
            const meal = this.state.mealPlan[mealType];
            const mealImages = this.state.mealPlanImages[mealType];

            return (
              <React.Fragment key={index}>
                {index === currentPage && (
                  <React.Fragment>
                    {Object.keys(this.state.mealPlan).length !== 0 && (
                      <React.Fragment>
                        <Text style={styles.mealType}>
                          {translateMealType(mealType).toUpperCase()}
                        </Text>
                        <View style={styles.paginationContainer}>
                          <TouchableOpacity
                            onPress={goToPreviousPage}
                            disabled={currentPage === 0}
                          >
                            <Ionicons
                              name="ios-arrow-back"
                              size={24}
                              color={currentPage === 0 ? "gray" : "black"}
                            />
                          </TouchableOpacity>
                          <Text>Страница {currentPage + 1} от 3</Text>
                          <TouchableOpacity
                            onPress={goToNextPage}
                            disabled={currentPage === 2}
                          >
                            <Ionicons
                              name="ios-arrow-forward"
                              size={24}
                              color={currentPage === 2 ? "gray" : "black"}
                            />
                          </TouchableOpacity>
                        </View>
                      </React.Fragment>
                    )}
                    {meal &&
                      Object.keys(meal).map((itemType) => {
                        const item = meal[itemType];
                        const mealImage = mealImages
                          ? mealImages[itemType]
                          : null;

                        if (item) {
                          return (
                            <Block
                              style={styles.inputContainer}
                              key={`${mealType}-${itemType}`}
                            >
                              <RecipeWidget image={mealImage} item={item} />
                            </Block>
                          );
                        } else {
                          return null;
                        }
                      })}
                    {Object.keys(this.state.mealPlan).length !== 0 && (
                      <Deviations
                        mealPlan={this.state.mealPlan}
                        userPreferences={userPreferences}
                        isPlanGeneratedWithOpenAI={isPlanGeneratedWithOpenAI}
                      />
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mealType: {
    fontWeight: "bold",
    fontSize: 30,
    marginTop: 5,
    textAlign: "center"
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    gap: 10
  },
  scrollViewContent: {
    flexGrow: 1
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20
  },
  button: {
    flex: 1,
    backgroundColor: "#9a99ff",
    borderRadius: 10,
    justifyContent: "center",
    marginHorizontal: 5
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18
  },
  loaderContainer: {
    marginBottom: 30,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    textAlign: "center",
    lineHeight: 19,
    fontWeight: "bold", // Change fontWeight to "bold" for a heavier font
    color: nutriTheme.COLORS.HEADER,
    margin: 10
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  dropdownLabel: {
    marginRight: 10,
    fontSize: 16,
    color: "#000" // Set label text color to ensure visibility
  },
  dropdownPicker: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 15,
    padding: 10,
    backgroundColor: "#fff" // Set a background color for better visibility
  },
  pickerItem: {
    fontSize: 16, // Adjust item font size for better visibility
    color: "#000" // Set item text color to ensure visibility
  }
});

export default MealPlanner;
