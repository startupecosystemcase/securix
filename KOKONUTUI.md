# KokonutUI - Интеграция в проект Securix

## Установка

KokonutUI интегрирован в проект через shadcn CLI. Регистр настроен в `components.json`:

```json
{
  "registries": {
    "@kokonutui": "https://kokonutui.com/r/{name}.json"
  }
}
```

## Установленные компоненты

### Particle Button
Компонент кнопки с анимацией частиц при клике.

**Расположение:** `src/components/kokonutui/particle-button.tsx`

**Использование:**
```tsx
import ParticleButton from "@/components/kokonutui/particle-button";

export default function Page() {
  return (
    <ParticleButton
      onClick={() => console.log("Clicked!")}
      onSuccess={() => console.log("Success!")}
      successDuration={1000}
    >
      Нажми меня
    </ParticleButton>
  );
}
```

**Пропсы:**
- `onClick` - обработчик клика
- `onSuccess` - вызывается после завершения анимации
- `successDuration` - длительность анимации (по умолчанию 1000ms)
- Все стандартные пропсы `Button` из shadcn/ui

## Установка новых компонентов

Для установки новых компонентов KokonutUI используйте команду:

```bash
npx shadcn@latest add @kokonutui/component-name
```

Например:
```bash
npx shadcn@latest add @kokonutui/particle-button
```

## Зависимости

- `motion` (уже установлен)
- `lucide-react` (уже установлен)
- `tailwindcss` v4 (уже установлен)

## Документация

Официальная документация: https://kokonutui.com/Docs

## Примеры использования

### В Hero секции
```tsx
import ParticleButton from "@/components/kokonutui/particle-button";

<ParticleButton
  size="lg"
  className="bg-gradient-to-r from-yellow-500 to-yellow-600"
  onClick={() => router.push('/register')}
  onSuccess={() => console.log("Registration started")}
>
  Начать бесплатно
</ParticleButton>
```

### В формах
```tsx
<ParticleButton
  type="submit"
  disabled={isSubmitting}
  onSuccess={() => {
    // Показать уведомление об успехе
    toast.success("Форма отправлена!");
  }}
>
  Отправить
</ParticleButton>
```

