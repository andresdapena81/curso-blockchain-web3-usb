# Árbol de Merkle · código de la Sesión 2

**Blockchain y Web 3.0 · Universidad de San Buenaventura Medellín**

Este es el código que recorremos en clase. **Viene completo.** No hay que escribirlo: hay que entenderlo, ejecutarlo y romperlo. Son unas setenta líneas y en ellas está toda la Sesión 2.

---

## Ejecutarlo

```bash
cd python && python merkle.py
```

```bash
cd js && node --test
```

En Python, `merkle.py` imprime los dos hashes de referencia, los bits distintos, la raíz de ocho elementos y una prueba de inclusión. En JavaScript, la suite de pruebas comprueba lo mismo.

---

## Los cuatro pasos de la clase

**1 · Comparar la raíz.** La de `lote-000` … `lote-007` debe ser exactamente:

```
53c895e4efd5451ab9e313d532203158e907660d0e5d860a5a5cc99ada592fa3
```

Si no coincide, la diferencia está en una de las tres convenciones de abajo.

**2 · Romperla.** Cambien un solo carácter de un solo dato y vuelvan a ejecutar. La raíz cambia por completo. Eso es el compromiso de la raíz, comprobado en su propia pantalla.

**3 · Pedir una prueba.** `generar_prueba(lotes, 2)` devuelve tres hashes para un conjunto de ocho: log₂(8). Verifíquenla.

**4 · Rechazar.** Verifiquen un dato que **no** esté en el conjunto y comprueben que devuelve falso. Una verificación que solo acepta lo correcto está a medio escribir.

---

## Las tres convenciones

Si su raíz no coincide con la de otra pareja —o con la del visor—, la causa está aquí, en este orden de probabilidad:

1. **Las hojas son el hash del dato**, no el dato crudo.
2. **Al combinar dos nodos se concatenan sus bytes**, no sus cadenas hexadecimales. De ahí el `bytes.fromhex()` / `Buffer.from(hex, "hex")` de `_combinar`.
3. **Si un nivel tiene un número impar de elementos, se duplica el último.** Es una convención, no una ley matemática: otras implementaciones eligen distinto y obtienen otra raíz.

---

## Valores de referencia

```
sha256("USB Medellin") = a4bca74553f433194546f1ca04e5ac3980e9005c4ce7041f594a2b15f50ff0cc
sha256("USB Medellín") = 6a26f8eaf52f416dc14ad4dfe64db2c16e17c4f4e03e1a4022062f7b9ba7a6bd

bits distintos = 134 de 256  (52,3 %)
```

Una tilde de diferencia. Ese es el efecto avalancha.

---

## El visor

Hay una página que implementa exactamente estas mismas tres convenciones: permite editar los datos, ver la raíz cambiar, hacer clic en una hoja para obtener su prueba de inclusión y seguir la verificación paso a paso.

**La raíz del visor y la de este código deben ser idénticas.** Es la forma más rápida de comprobar que su implementación —si deciden escribir la suya— está bien.

---

## El trabajo del semestre

A partir de este código, **construir una interfaz web que lo haga visible**. No hay que reimplementar la criptografía: ya está resuelta y probada.

**Mínimo exigible**

- Un campo para introducir varios datos.
- La raíz calculada y visible.
- Que la raíz cambie al editar un dato.
- Que se vea, de alguna forma, la estructura del árbol.

**Suma, sin ser obligatorio**

- Prueba de inclusión al hacer clic en un elemento.
- Verificación paso a paso, mostrando cada combinación.
- Rechazo visible de un elemento que no pertenece.

**Tecnología libre.** Puede ser una sola página con HTML y JavaScript, o el marco de trabajo que prefieran. Lo que se evalúa es que funcione y que se entienda lo que muestra.

---

## Si quieren escribirlo ustedes mismos

`python/andamiaje/` y `js/andamiaje/` contienen el mismo código **vaciado**, con las firmas, la documentación y las pistas intactas. Los archivos de prueba son la especificación.

```bash
cd python && cp andamiaje/merkle.py . && python -m pytest test_merkle.py -v
```

```bash
cd js && cp andamiaje/merkle.js . && node --test
```

Son 24 pruebas en Python y 23 en JavaScript. **Es opcional** y no sustituye al trabajo de la interfaz: está para quien quiera el ejercicio completo.

Para volver al código resuelto, vuelvan a copiarlo desde el repositorio del curso.
