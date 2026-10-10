// Multi-Subject Day-by-Day Progressive Notes, YouTube Masterclasses & Verified Web Documentation Database

export const SUBJECTS_LIST = [
  { 
    id: "python", 
    name: "Python Engineering & CPython Internals", 
    icon: "🐍", 
    totalDays: 10, 
    level: "Foundations to Advanced Internals",
    primaryDocUrl: "https://docs.python.org/3/",
    docName: "Official Python 3.12+ Documentation"
  },
  { 
    id: "web", 
    name: "Full-Stack Web (React 19 & Node.js)", 
    icon: "⚛️", 
    totalDays: 10, 
    level: "Modern Frontend & Backend Systems",
    primaryDocUrl: "https://react.dev",
    docName: "Official React 19 Docs & MDN Web Docs"
  },
  { 
    id: "dsa", 
    name: "Data Structures & Algorithmic Design", 
    icon: "🌲", 
    totalDays: 10, 
    level: "Core Algorithms & Big-O Optimization",
    primaryDocUrl: "https://web.stanford.edu/class/cs166/",
    docName: "Stanford CS166 & MIT Algorithms"
  },
  { 
    id: "java", 
    name: "Java & JVM Enterprise Architecture", 
    icon: "☕", 
    totalDays: 10, 
    level: "OOP, Multithreading & Memory Management",
    primaryDocUrl: "https://docs.oracle.com/en/java/javase/21/docs/api/",
    docName: "Oracle Java SE 21 LTS Specifications"
  },
  { 
    id: "devops", 
    name: "Cloud Native & DevOps Engineering", 
    icon: "☁️", 
    totalDays: 10, 
    level: "Kubernetes, Docker & CI/CD Pipelines",
    primaryDocUrl: "https://kubernetes.io/docs/home/",
    docName: "Kubernetes & Cloud Native Standards"
  }
];

export const SUBJECT_WEB_DOCUMENTATION = {
  python: [
    { title: "Python 3 Official Tutorial", url: "https://docs.python.org/3/tutorial/index.html", source: "Python Software Foundation", desc: "The definitive reference for Python syntax, standard library, and language grammar." },
    { title: "Python Standard Library Index", url: "https://docs.python.org/3/library/index.html", source: "docs.python.org", desc: "Comprehensive documentation for built-in modules: asyncio, json, collections, math, itertools." },
    { title: "Python Data Model & Memory Reference", url: "https://docs.python.org/3/reference/datamodel.html", source: "docs.python.org", desc: "Object model, special dunder methods, descriptor protocols, and metaclasses." },
    { title: "Real Python Deep Dives", url: "https://realpython.com/", source: "Real Python", desc: "In-depth engineering guides for async programming, memory profiling, and architecture patterns." }
  ],
  web: [
    { title: "MDN Web Docs (Mozilla Developer Network)", url: "https://developer.mozilla.org/en-US/", source: "Mozilla MDN", desc: "The industry standard reference for HTML5, CSS3 Flexbox/Grid, and modern ES6+ JavaScript." },
    { title: "Official React 19 Documentation", url: "https://react.dev", source: "React.dev", desc: "Learn interactive UI architecture, Server Components, Hooks, Suspense, and state management." },
    { title: "Node.js v20 LTS Architecture Guides", url: "https://nodejs.org/en/docs/guides", source: "Node.js Foundation", desc: "Event loop execution mechanics, non-blocking asynchronous I/O, streams, and buffer architectures." },
    { title: "TypeScript Official Handbook", url: "https://www.typescriptlang.org/docs/", source: "Microsoft TypeScript", desc: "Generics, conditional typing, utility types, and structural type system rules." }
  ],
  dsa: [
    { title: "MIT OpenCourseWare: Introduction to Algorithms (6.006)", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", source: "MIT OCW", desc: "Fundamental algorithmic paradigms: divide & conquer, dynamic programming, graph traversals, and amortized complexity." },
    { title: "Stanford CS166: Advanced Data Structures", url: "https://web.stanford.edu/class/cs166/", source: "Stanford University", desc: "Tries, Fenwick Trees, Segment Trees, Disjoint Set Union (Union-Find), and Fibonacci Heaps." },
    { title: "GeeksforGeeks Algorithm Repository", url: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/", source: "GeeksforGeeks", desc: "Comprehensive visual trace diagrams and implementations in C++, Python, and Java." }
  ],
  java: [
    { title: "Oracle Java SE 21 Documentation", url: "https://docs.oracle.com/en/java/javase/21/", source: "Oracle Docs", desc: "Official language specifications, virtual threads (Project Loom), pattern matching, and garbage collector tuning." },
    { title: "Baeldung Spring & Java Engineering", url: "https://www.baeldung.com/", source: "Baeldung", desc: "Enterprise guides for Spring Boot 3, Hibernate ORM, multithreading, and JVM internals." }
  ],
  devops: [
    { title: "Official Kubernetes (K8s) Documentation", url: "https://kubernetes.io/docs/home/", source: "CNCF", desc: "Pod lifecycle, ReplicaSets, Deployments, Cluster Architecture, Ingress Controllers, and Helm Charts." },
    { title: "Docker Engine Architecture Guides", url: "https://docs.docker.com/engine/", source: "Docker Inc.", desc: "Container namespaces, cgroups, layered storage drivers, multi-stage builds, and compose specs." },
    { title: "GitHub Actions CI/CD Documentation", url: "https://docs.github.com/en/actions", source: "GitHub", desc: "Automated test suites, security vulnerability scanning, container registry publishing, and cloud deployment." }
  ]
};

export const ALL_SUBJECT_DAY_NOTES = {
  python: [
    {
      id: "py-1",
      dayNumber: 1,
      subject: "Python Engineering",
      topicCategory: "Execution Architecture & Memory",
      title: "Day 1: CPython VM, Bytecode Compilation & Memory Allocation",
      summary: "Understand how the CPython interpreter compiles source code (.py) into intermediate bytecode (.pyc) and executes it on the stack-based virtual machine, utilizing PyObject memory pointers.",
      deepExplanation: "Python is not purely interpreted; it operates as an interpreted bytecode virtual machine. When you run `python main.py`, the Lexer converts characters into tokens, the Parser constructs an Abstract Syntax Tree (AST), and the Compiler emits Python Bytecode. The CPython Virtual Machine processes opcodes (like `LOAD_FAST`, `BINARY_ADD`) using an internal evaluation loop (`ceval.c`). In memory, every integer, string, and function is a C `struct PyObject` containing an object type pointer (`ob_type`) and an atomic reference counter (`ob_refcnt`). Python maintains a pre-allocated pool of small integers (-5 to 256) and interned strings to optimize memory footprint and accelerate pointer equality checks.",
      eli10: {
        title: "The Multilingual Chef & Recipe Cards",
        story: "Imagine Python as an English cookbook. Instead of cooking raw ingredients directly, a Sous-Chef first translates the recipe into standardized shorthand instruction cards (Bytecode). The Head Chef (CPython Engine) reads these quick cards one by one at lightning speed, pulling pre-prepared spice jars (cached small integers) from a quick-access pantry!",
        keyConcepts: [
          { term: "Bytecode", meaning: "Intermediate platform-independent assembly instructions (.pyc) executed by the CPython VM." },
          { term: "PyObject", meaning: "The fundamental C structure underlying every Python value, tracking type info and reference counts." },
          { term: "Integer Interning", meaning: "CPython memory optimization that reuses identical memory addresses for integers from -5 to 256." }
        ]
      },
      codeSnippet: `# Inspecting Bytecode Compilation in Real-Time
import dis

def calculate_tax(amount: float, rate: float = 0.08) -> float:
    \"\"\"Calculates total tax using local stack variables.\"\"\"
    total = amount * rate
    return round(total, 2)

print("=== Disassembled Python Bytecode ===")
dis.dis(calculate_tax)

# Demonstrating Integer Interning & Memory ID
a = 250
b = 250
print(f"Memory Identical for small int: {a is b} (IDs: {id(a)}, {id(b)})")`,
      expectedOutput: `=== Disassembled Python Bytecode ===
  4           0 LOAD_FAST                0 (amount)
              2 LOAD_FAST                1 (rate)
              4 BINARY_MULTIPLY
              6 STORE_FAST               2 (total)
  5           8 LOAD_GLOBAL              0 (round)
             10 LOAD_FAST                2 (total)
             12 LOAD_CONST               2 (2)
             14 CALL_FUNCTION            2
             16 RETURN_VALUE
Memory Identical for small int: True`,
      pitfalls: "Confusing `==` (value equality) with `is` (reference identity). Comparing large numbers with `is` produces flaky bugs outside the -5 to 256 interned pool.",
      practiceChallenge: {
        question: "Write a function `inspect_object_internals(val)` that prints the object's memory address, reference count using `sys.getrefcount`, and its memory byte size using `sys.getsizeof`.",
        solutionCode: `import sys

def inspect_object_internals(val):
    return {
        "memory_id": hex(id(val)),
        "ref_count": sys.getrefcount(val) - 1, # Subtract temporary argument reference
        "byte_size": sys.getsizeof(val),
        "type": type(val).__name__
    }

print(inspect_object_internals("SkillsMap Architecture"))`
      },
      quiz: {
        question: "Why does `a = 250; b = 250; a is b` evaluate to True in standard CPython, but `a = 1000; b = 1000; a is b` may evaluate to False in interactive mode?",
        options: [
          "Numbers above 256 are automatically converted into strings",
          "CPython pre-allocates and interns small integers between -5 and 256 in a static array",
          "Large integers cannot be stored in RAM",
          "The garbage collector destroys integers greater than 256"
        ],
        correctIndex: 1,
        hint: "Think about small numbers Python uses frequently: it saves memory by reusing the same number boxes for -5 up to 256.",
        explanation: "CPython maintains a static array of integer objects for values between -5 and 256. Any integer in this range reuses the exact same PyObject pointer, making 'is' return True."
      },
      youtubeLectures: [
        {
          title: "Python Under the Hood: CPython Internals & Bytecode",
          channel: "ArjanCodes / EuroPython",
          duration: "24 mins",
          url: "https://www.youtube.com/watch?v=cSSpnq362Bk",
          videoId: "cSSpnq362Bk",
          summary: "Deep dive into how CPython parses source code into AST, compiles it into bytecode, and evaluates opcodes in ceval.c.",
          timestampGuide: [
            { time: "00:00", label: "Introduction to Interpreters vs Compilers" },
            { time: "05:15", label: "AST Construction and Tokenization" },
            { time: "12:30", label: "Bytecode Disassembly with dis module" },
            { time: "18:40", label: "Memory Allocation & PyObject Struct" }
          ]
        },
        {
          title: "Memory Management & Garbage Collection in Python",
          channel: "mCoding",
          duration: "18 mins",
          url: "https://www.youtube.com/watch?v=F6u5rhz6glY",
          videoId: "F6u5rhz6glY",
          summary: "Explanation of reference counting, cyclical garbage collection generations, and memory leak prevention.",
          timestampGuide: [
            { time: "00:00", label: "Reference Counting Mechanics" },
            { time: "06:20", label: "Generational Garbage Collector (Gen 0, 1, 2)" },
            { time: "14:10", label: "Weak References and Memory Profiling" }
          ]
        }
      ],
      externalResources: [
        {
          title: "CPython Internal Architecture Guide",
          url: "https://devguide.python.org/internals/exploring-cpython/",
          provider: "Python Developer's Guide",
          type: "Official Specification",
          desc: "Source code walkthrough of the CPython evaluation loop, AST compiler, and memory allocator."
        },
        {
          title: "The Python Data Model (Official Docs)",
          url: "https://docs.python.org/3/reference/datamodel.html",
          provider: "docs.python.org",
          type: "Language Reference",
          desc: "Comprehensive documentation of PyObject, descriptor protocols, dunder methods, and memory lifecycles."
        }
      ],
      webLink: {
        title: "Python 3 Execution Model & Data Model (Official)",
        url: "https://docs.python.org/3/reference/executionmodel.html"
      }
    },
    {
      id: "py-2",
      dayNumber: 2,
      subject: "Python Engineering",
      topicCategory: "Data Structures & Memory Complexity",
      title: "Day 2: List Over-Allocation, Dict Hash Tables & Time Complexity",
      summary: "Explore dynamic array resizing mathematics in Python lists and open-addressing quadratic probing hash tables powering Python 3.7+ ordered dictionaries.",
      deepExplanation: "Python lists are not linked lists; they are contiguous dynamic arrays of object pointers (`PyListObject`). To achieve amortized O(1) appending, CPython utilizes an over-allocation growth formula: `new_allocated = (newsize >> 3) + (newsize < 9 ? 3 : 6) + newsize`. Dictionaries in Python 3.7+ are compact and insertion-ordered. They use a sparse index array pointing into a dense array of entries containing `[hash, key_ptr, value_ptr]`. Hash lookups compute `hash(key) % table_size` and resolve collisions via quadratic perturbation `perturb >>= 5; i = (5*i + 1 + perturb) & mask`.",
      eli10: {
        title: "The Expandable Backpack & The VIP Coat Check",
        story: "Imagine buying a backpack with 4 pockets. When you need a 5th item, you don't just buy a 5-pocket bag; the store gives you an 8-pocket bag so you don't have to upgrade every single time! A Python Dictionary is like a coat check room where every coat ticket has a secret mathematical formula that tells the attendant exactly which rack your coat is on instantly!",
        keyConcepts: [
          { term: "Amortized O(1)", meaning: "Occasional expensive resize operations are mathematically spread over many fast O(1) operations." },
          { term: "Compact Dict", meaning: "Splitting keys/values from the index array to save up to 40% memory while preserving insertion order." },
          { term: "Hash Collision", meaning: "When two different keys produce the same modulo index, resolved using probing algorithms." }
        ]
      },
      codeSnippet: `import sys

# Monitoring List Memory Growth Strategy
my_list = []
print("Length | Memory Size (Bytes)")
print("-" * 25)
for i in range(16):
    print(f"{len(my_list):<6} | {sys.getsizeof(my_list)} bytes")
    my_list.append(i)

# Dict Fast O(1) Key Membership Check
user_cache = {"uid_101": "Alice", "uid_102": "Bob"}
print("\\nIs uid_101 present?:", "uid_101" in user_cache)`,
      expectedOutput: `Length | Memory Size (Bytes)
-------------------------
0      | 56 bytes
1      | 88 bytes
2      | 88 bytes
3      | 88 bytes
4      | 88 bytes
5      | 120 bytes
...
Is uid_101 present?: True`,
      pitfalls: "Using `in` on a huge list (O(N) linear scan) instead of a `set` or `dict` (O(1) hash lookup) inside a loop, turning an algorithm into O(N^2) disaster.",
      practiceChallenge: {
        question: "Build a custom `LRUCache(capacity)` using Python's `collections.OrderedDict` that supports `get(key)` and `put(key, value)` in strict O(1) time.",
        solutionCode: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

lru = LRUCache(2)
lru.put(1, 100); lru.put(2, 200)
print("Get 1:", lru.get(1)) # moves 1 to end
lru.put(3, 300) # evicts 2
print("Get 2 (evicted):", lru.get(2))`
      },
      quiz: {
        question: "What is the average time complexity of looking up a key in a Python dictionary versus checking an element in a Python list of size N?",
        options: [
          "Both are O(log N)",
          "Dict is O(N); List is O(1)",
          "Dict is O(1) average; List is O(N) linear time",
          "Both are O(1)"
        ],
        correctIndex: 2,
        hint: "A dictionary uses a hash key like a coat check ticket to jump straight to the item instantly (O(1)), while checking a list means looking at every single coat in row order (O(N)).",
        explanation: "Python dictionaries use hash tables which achieve O(1) average lookup time, whereas searching in a list requires traversing each element sequentially (O(N))."
      },
      youtubeLectures: [
        {
          title: "The Dictionary Even Mightier: Python Dict Internals",
          channel: "Brandon Rhodes / PyCon",
          duration: "42 mins",
          url: "https://www.youtube.com/watch?v=66P5FMkWoVU",
          videoId: "66P5FMkWoVU",
          summary: "The legendary PyCon presentation explaining the exact C structure and hashing algorithms behind Python dictionaries.",
          timestampGuide: [
            { time: "00:00", label: "Why Hashing Works" },
            { time: "14:20", label: "Hash Collision Resolution" },
            { time: "28:10", label: "Compact Dictionary Architecture" },
            { time: "38:00", label: "Performance Benchmarks" }
          ]
        }
      ],
      externalResources: [
        {
          title: "Python TimeComplexity Reference (Official Wiki)",
          url: "https://wiki.python.org/moin/TimeComplexity",
          provider: "Python Software Foundation",
          type: "Algorithm Spec",
          desc: "Official table detailing Big-O operations for list, deque, set, and dict."
        }
      ],
      webLink: {
        title: "Python Standard Library: Built-in Types (docs.python.org)",
        url: "https://docs.python.org/3/library/stdtypes.html"
      }
    },
    {
      id: "py-3",
      dayNumber: 3,
      subject: "Python Engineering",
      topicCategory: "Advanced Control Flow",
      title: "Day 3: Generators, Iterators & Memory-Efficient Streaming",
      summary: "Master the iterator protocol (__iter__, __next__), lazy evaluation with yield, and streaming gigabytes of data without RAM exhaustion.",
      deepExplanation: "Standard functions execute via stack frames that allocate local variables and evaporate upon `return`. Generator functions containing `yield` compile into special generator code objects (`PyGenObject`). When invoked, they return an iterator without running code. Calling `next()` restores the instruction pointer (`gi_frame.f_lasti`), runs bytecode until the next `yield` expression, freezes the frame state, and yields the value. This enables lazy, stream-based data pipelines that process multi-gigabyte log files with constant O(1) memory footprint.",
      eli10: {
        title: "The Water Dispenser vs. The Whole Swimming Pool",
        story: "Loading a 10GB file all at once is like dumping an entire swimming pool into your living room all at once! A Python generator is like a water cooler tap: it dispenses just one glass at a time right when you are thirsty, keeping your house dry and clean!",
        keyConcepts: [
          { term: "Lazy Evaluation", meaning: "Delaying computation of a value until the exact moment it is requested by the consumer." },
          { term: "Iterator Protocol", meaning: "Objects implementing __iter__() and __next__() methods, raising StopIteration when exhausted." },
          { term: "Yield From", meaning: "Delegating sub-generator iteration directly to another iterable with zero manual loop boilerplate." }
        ]
      },
      codeSnippet: `import sys

# Memory Comparison: List Comprehension vs Generator Expression
list_comp = [x ** 2 for x in range(100000)]
gen_expr = (x ** 2 for x in range(100000))

print(f"List in RAM: {sys.getsizeof(list_comp):,} bytes")
print(f"Generator in RAM: {sys.getsizeof(gen_expr):,} bytes")

# Generator Function for Fibonacci Streaming
def fibonacci_stream(limit: int):
    a, b = 0, 1
    for _ in range(limit):
        yield a
        a, b = b, a + b

print("First 6 Fibs:", list(fibonacci_stream(6)))`,
      expectedOutput: `List in RAM: 800,984 bytes
Generator in RAM: 104 bytes
First 6 Fibs: [0, 1, 1, 2, 3, 5]`,
      pitfalls: "Trying to index into a generator (e.g. `gen[0]`) or iterating over a generator twice without re-instantiating it after it has been exhausted.",
      practiceChallenge: {
        question: "Create a generator `chunked_stream(iterable, chunk_size)` that yields batches of items of size `chunk_size` without loading all items in memory.",
        solutionCode: `def chunked_stream(iterable, chunk_size):
    chunk = []
    for item in iterable:
        chunk.append(item)
        if len(chunk) == chunk_size:
            yield chunk
            chunk = []
    if chunk:
        yield chunk

for batch in chunked_stream(range(10), 3):
    print("Batch:", batch)`
      },
      quiz: {
        question: "What happens when a generator reaches the end of its execution without encountering another yield?",
        options: [
          "It resets to the beginning and loops infinitely",
          "It returns None and crashes the Python runtime",
          "It raises a StopIteration exception to signal completion",
          "It automatically deletes its own code from memory"
        ],
        correctIndex: 2,
        hint: "When there is no more water left in the jug, Python raises a special signal telling the for-loop to 'Stop' iterating.",
        explanation: "In the Python iterator protocol, completing a generator or calling next() past the end triggers a StopIteration exception, which for-loops catch automatically."
      },
      youtubeLectures: [
        {
          title: "Generators: The Secret Power of Python",
          channel: "Corey Schafer",
          duration: "30 mins",
          url: "https://www.youtube.com/watch?v=bD05uGo_sVI",
          videoId: "bD05uGo_sVI",
          summary: "Comprehensive walkthrough on why generators save memory, how to construct pipelines, and performance comparisons.",
          timestampGuide: [
            { time: "00:00", label: "Memory Problems with Lists" },
            { time: "08:15", label: "Writing your first Generator Function" },
            { time: "18:30", label: "Chaining Generators in Pipelines" }
          ]
        }
      ],
      externalResources: [
        {
          title: "PEP 255: Simple Generators Specification",
          url: "https://peps.python.org/pep-0255/",
          provider: "Python Enhancement Proposals",
          type: "Official Standard",
          desc: "The original architectural standard defining yield semantics in Python."
        }
      ],
      webLink: {
        title: "Python Documentation: Generator Expressions & Itertools",
        url: "https://docs.python.org/3/howto/functional.html#generators"
      }
    },
    {
      id: "py-4",
      dayNumber: 4,
      subject: "Python Engineering",
      topicCategory: "Metaprogramming & Decorators",
      title: "Day 4: Decorators, Closures & Function Wrappers",
      summary: "Understand first-class functions, lexical closures with __closure__ cell references, and parameterized decorators with functools.wraps.",
      deepExplanation: "In Python, functions are first-class objects. A closure occurs when an inner function retains references to variables in its enclosing lexical scope even after the outer function has finished executing. The CPython bytecode stores these non-local variables inside a tuple of `cell` objects (`fn.__closure__`). A decorator is syntactic sugar: `@my_decorator` placed above `def func(): ...` translates to `func = my_decorator(func)`. To preserve docstrings, function names, and signature introspection, professional decorators must utilize `@functools.wraps(fn)` to mirror `__name__` and `__wrapped__` attributes.",
      eli10: {
        title: "The Gift Box Wrapper & Security Guard",
        story: "A decorator is like a security guard stationed at the door of a VIP lounge. Before anyone enters the room (calls the function), the guard checks your ID badge (logs the timestamp), lets you do your work, and logs the exit time on the way out, without altering what happens inside the room!",
        keyConcepts: [
          { term: "Closure", meaning: "A function object that remembers values in enclosing scopes regardless of whether those scopes are in memory." },
          { term: "functools.wraps", meaning: "A decorator factory that copies metadata (__name__, __doc__, __annotations__) from original to wrapper." },
          { term: "Parametric Decorator", meaning: "A three-tier function wrapper that accepts configuration arguments before accepting the target function." }
        ]
      },
      codeSnippet: `import time
from functools import wraps

def benchmark(repeat: int = 1):
    \"\"\"Decorator factory that measures average execution time.\"\"\"
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            total_time = 0.0
            result = None
            for _ in range(repeat):
                start = time.perf_counter()
                result = func(*args, **kwargs)
                total_time += time.perf_counter() - start
            avg = (total_time / repeat) * 1000
            print(f"[{func.__name__}] Avg Time ({repeat} runs): {avg:.4f} ms")
            return result
        return wrapper
    return decorator

@benchmark(repeat=3)
def process_data(n: int):
    return sum(i * i for i in range(n))

print("Result:", process_data(50000))`,
      expectedOutput: `[process_data] Avg Time (3 runs): 3.1200 ms
Result: 41665416675000`,
      pitfalls: "Forgetting `@wraps(func)` in custom decorators, which destroys function metadata and breaks debugging tools, Sphinx documentation generators, and unit tests.",
      practiceChallenge: {
        question: "Write an `@enforce_types` decorator that checks if passed positional arguments match the function's type annotations, raising a `TypeError` if invalid.",
        solutionCode: `from functools import wraps

def enforce_types(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        annotations = func.__annotations__
        for arg, (param, expected_type) in zip(args, annotations.items()):
            if not isinstance(arg, expected_type):
                raise TypeError(f"Argument '{param}' must be {expected_type.__name__}, got {type(arg).__name__}")
        return func(*args, **kwargs)
    return wrapper

@enforce_types
def add_points(x: int, y: int) -> int:
    return x + y

print("Valid:", add_points(10, 20))
# add_points("10", 20) # Raises TypeError`
      },
      quiz: {
        question: "Why is `@functools.wraps(func)` considered a critical best practice when authoring custom Python decorators?",
        options: [
          "It speeds up execution time by compiling the function into C code",
          "It preserves the original function's name, docstring, and module attributes on the wrapper",
          "It prevents the function from being garbage collected",
          "It allows the function to bypass Python's Global Interpreter Lock (GIL)"
        ],
        correctIndex: 1,
        hint: "When you wrap a gift box, you still want the label tag to show the real original sender's name and notes.",
        explanation: "@functools.wraps copies the __name__, __doc__, and other introspection metadata from the target function onto the wrapper so debuggers and logging frameworks can inspect it accurately."
      },
      youtubeLectures: [
        {
          title: "Python Decorators in 15 Minutes",
          channel: "ArjanCodes",
          duration: "16 mins",
          url: "https://www.youtube.com/watch?v=r7Dtus7N4pI",
          videoId: "r7Dtus7N4pI",
          summary: "Clear explanation of closures, first-class functions, and building clean parameterized decorators with real-world use cases.",
          timestampGuide: [
            { time: "00:00", label: "Functions as First Class Objects" },
            { time: "04:30", label: "Understanding Closures" },
            { time: "09:00", label: "Building Decorator with Arguments" }
          ]
        }
      ],
      externalResources: [
        {
          title: "Real Python: Primer on Python Decorators",
          url: "https://realpython.com/primer-on-python-decorators/",
          provider: "Real Python",
          type: "Tutorial & Best Practices",
          desc: "Comprehensive handbook covering classes as decorators, nesting decorators, and stateful decorators."
        }
      ],
      webLink: {
        title: "Python functools Module Documentation (Official)",
        url: "https://docs.python.org/3/library/functools.html#functools.wraps"
      }
    },
    {
      id: "py-5",
      dayNumber: 5,
      subject: "Python Engineering",
      topicCategory: "Concurrency & AsyncIO",
      title: "Day 5: Asynchronous Event Loops & Non-Blocking AsyncIO",
      summary: "Understand single-threaded asynchronous concurrency, coroutines with async/await, and the asyncio event loop execution mechanics.",
      deepExplanation: "Traditional multithreading incurs OS thread context-switching overhead and is constrained by Python's Global Interpreter Lock (GIL) for CPU tasks. AsyncIO uses cooperative multitasking on a single thread. When a function is defined with `async def`, it compiles into a Coroutine object. When it encounters `await some_io_task()`, it pauses execution and yields control back to the central Event Loop (`asyncio.run()`). The event loop monitors OS file descriptors using platform-native I/O multiplexers (like `epoll` on Linux, `kqueue` on macOS) and resumes the coroutine when socket data arrives.",
      eli10: {
        title: "The Single Waiter at a Busy Restaurant",
        story: "In multithreading, you hire 100 waiters (expensive threads) who stand idly at every table waiting for food to cook. In AsyncIO, one super-smart waiter takes an order, sends it to the kitchen (async I/O), immediately takes orders from 10 other tables, and serves food the exact microsecond the chef rings the bell!",
        keyConcepts: [
          { term: "Event Loop", meaning: "The central scheduler that continuously monitors tasks, runs ready callbacks, and handles I/O notifications." },
          { term: "Coroutine", meaning: "A specialized generator-like function declared with async def that can pause execution via await." },
          { term: "asyncio.gather", meaning: "Concurrent execution manager that fires multiple coroutines simultaneously and aggregates results." }
        ]
      },
      codeSnippet: `import asyncio
import time

async def fetch_user_data(user_id: int):
    print(f"-> Fetching User {user_id}...")
    await asyncio.sleep(0.5) # Simulating network I/O
    print(f"<- Received User {user_id}!")
    return {"id": user_id, "status": "active"}

async def main():
    start = time.perf_counter()
    # Execute 3 network requests concurrently
    results = await asyncio.gather(
        fetch_user_data(101),
        fetch_user_data(102),
        fetch_user_data(103)
    )
    duration = time.perf_counter() - start
    print(f"All 3 finished concurrently in {duration:.2f}s!")
    print("Results:", results)

asyncio.run(main())`,
      expectedOutput: `-> Fetching User 101...
-> Fetching User 102...
-> Fetching User 103...
<- Received User 101!
<- Received User 102!
<- Received User 103!
All 3 finished concurrently in 0.51s!
Results: [{'id': 101, 'status': 'active'}, ...]`,
      pitfalls: "Calling blocking synchronous functions (like `time.sleep()` or synchronous `requests.get()`) inside an async function, which freezes the entire event loop for all users.",
      practiceChallenge: {
        question: "Write an async worker pool `async_worker_pool(tasks, max_concurrent=2)` using `asyncio.Semaphore` to limit parallel task execution.",
        solutionCode: `import asyncio

async def async_worker_pool(tasks, max_concurrent=2):
    sem = asyncio.Semaphore(max_concurrent)
    
    async def worker(task_name):
        async with sem:
            print(f"[Worker] Running {task_name}")
            await asyncio.sleep(0.2)
            return f"{task_name} DONE"

    return await asyncio.gather(*(worker(t) for t in tasks))

print("Results:", asyncio.run(async_worker_pool([f"Task-{i}" for i in range(5)])))`
      },
      quiz: {
        question: "What happens if a developer invokes `time.sleep(5)` inside an `async def` handler in a production FastAPI application?",
        options: [
          "FastAPI automatically spawns a new OS process to handle other requests",
          "AsyncIO converts time.sleep into an async awaitable automatically",
          "Only the current socket connection is paused without affecting other requests",
          "The entire single-threaded event loop blocks for 5 seconds, freezing all incoming user requests"
        ],
        correctIndex: 3,
        hint: "Remember the chef in the kitchen: if the single chef stands completely still and refuses to pass tasks to assistants, all food orders stop.",
        explanation: "Because AsyncIO runs on a single thread using cooperative multitasking, synchronous blocking calls like time.sleep() block the entire thread, halting all pending tasks on the event loop."
      },
      youtubeLectures: [
        {
          title: "AsyncIO in Python: Full Deep Dive Tutorial",
          channel: "Tech With Tim",
          duration: "25 mins",
          url: "https://www.youtube.com/watch?v=t5Bo1Je9EmE",
          videoId: "t5Bo1Je9EmE",
          summary: "Practical guide to understanding coroutines, tasks, event loops, and asyncio.gather with clear visual diagrams.",
          timestampGuide: [
            { time: "00:00", label: "Synchronous vs Asynchronous Explained" },
            { time: "07:30", label: "Creating Tasks with asyncio.create_task" },
            { time: "16:00", label: "Handling Gather and Timeouts" }
          ]
        }
      ],
      externalResources: [
        {
          title: "AsyncIO Official Architecture & API Reference",
          url: "https://docs.python.org/3/library/asyncio.html",
          provider: "Python Software Foundation",
          type: "Standard Library Spec",
          desc: "Complete documentation for event loops, streams, subprocesses, synchronization primitives, and queues."
        }
      ],
      webLink: {
        title: "Python AsyncIO Coroutines & Tasks (Official Documentation)",
        url: "https://docs.python.org/3/library/asyncio-task.html"
      }
    }
  ],
  web: [
    {
      id: "web-1",
      dayNumber: 1,
      subject: "Full-Stack Web (React 19 & Node.js)",
      topicCategory: "React 19 Reconciler & Fiber Architecture",
      title: "Day 1: React 19 Fiber Engine, Virtual DOM & Reconciliation",
      summary: "Understand React 19's Fiber reconciler, cooperative multitasking rendering, double-buffering work-in-progress trees, and synthetic event delegation.",
      deepExplanation: "React 19 does not mutate the real browser DOM during state updates. Instead, the Fiber Reconciler breaks rendering into two phases: the asynchronous Render Phase and the synchronous Commit Phase. In the Render Phase, React constructs a Work-in-Progress Fiber tree containing linked-list nodes with child, sibling, and return pointers. This phase can be interrupted and prioritized using the scheduler. In the Commit Phase, React takes the computed diff and applies mutations to the real DOM in a single rapid batch, followed by layout and passive effects execution.",
      eli10: {
        title: "The Architectural Blueprint & The 3D Printer",
        story: "Modifying the real DOM directly is like demolishing and rebuilding a brick wall for every tiny change. React creates an ultra-lightweight virtual blueprint (Fiber Tree), figures out the exact 2 bricks that changed, and swaps only those 2 bricks with laser precision in milliseconds!",
        keyConcepts: [
          { term: "Fiber Node", meaning: "A unit of work represented as a linked-list JavaScript object tracking component state, props, and effects." },
          { term: "Reconciliation", meaning: "The heuristic O(N) diffing algorithm React uses to compare the current tree with the work-in-progress tree." },
          { term: "Double Buffering", meaning: "Maintaining an active 'current' tree and an off-screen 'workInProgress' tree to avoid incomplete renders." }
        ]
      },
      codeSnippet: `import React, { useState, useTransition } from "react";

export function SearchFilterComponent({ items }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(items);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val); // High-priority urgent update (immediate user typing)

    // Non-blocking concurrent transition
    startTransition(() => {
      const results = items.filter(item => 
        item.toLowerCase().includes(val.toLowerCase())
      );
      setFiltered(results);
    });
  };

  return (
    <div className="p-4 space-y-2">
      <input 
        value={query} 
        onChange={handleSearch} 
        placeholder="Type to filter..." 
        className="border p-2 rounded"
      />
      {isPending && <p className="text-indigo-500">Updating list concurrently...</p>}
      <ul>
        {filtered.slice(0, 5).map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}`,
      expectedOutput: `// Interactive React Component Output:
Input typing renders at 60fps without freezing on large datasets.`,
      pitfalls: "Using array index as `key` in dynamic lists where items are inserted, deleted, or sorted. This causes React's reconciliation algorithm to retain stale component state and recreate DOM nodes unnecessarily.",
      practiceChallenge: {
        question: "Explain why `key={item.id}` is mandatory in dynamic lists and write a custom hook `useDebouncedValue(val, delayMs)` to prevent redundant renders.",
        solutionCode: `import { useState, useEffect } from "react";

export function useDebouncedValue(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}`
      },
      quiz: {
        question: "Why did React transition from the legacy Stack Reconciler to the Fiber Architecture?",
        options: [
          "To remove support for JavaScript classes",
          "To enable interruptible, prioritized rendering and prevent large tree diffs from blocking the browser main thread",
          "To force all React apps to use TypeScript",
          "To eliminate the need for CSS"
        ],
        correctIndex: 1,
        hint: "Think about pausing a movie to answer the phone: Fiber allows React to pause slow background work so user clicks and typing stay butter smooth.",
        explanation: "The Fiber architecture represents work as a linked list rather than a recursive call stack, allowing React to pause, prioritize, and resume rendering without dropping frames on user interactions."
      },
      youtubeLectures: [
        {
          title: "React Fiber Architecture: Deep Dive into Reconciler",
          channel: "Academind",
          duration: "28 mins",
          url: "https://www.youtube.com/watch?v=0sopS9T7iN8",
          videoId: "0sopS9T7iN8",
          summary: "Visual breakdown of how React schedules updates, builds work-in-progress trees, and manages reconciliation.",
          timestampGuide: [
            { time: "00:00", label: "The Problem with Stack Reconciler" },
            { time: "08:15", label: "What is a Fiber Node" },
            { time: "18:00", label: "Render vs Commit Phase" }
          ]
        }
      ],
      externalResources: [
        {
          title: "React.dev: Describing the UI & State Management",
          url: "https://react.dev/learn",
          provider: "Official React Team",
          type: "Official Documentation",
          desc: "The definitive guide to modern React 19 architecture, hooks, and component lifecycle."
        }
      ],
      webLink: {
        title: "React Architecture Overview & Reconciliation Specs (react.dev)",
        url: "https://react.dev/learn/preserving-and-resetting-state"
      }
    }
  ],
  dsa: [
    {
      id: "dsa-1",
      dayNumber: 1,
      subject: "Data Structures & Algorithms",
      topicCategory: "Algorithmic Complexity & Asymptotics",
      title: "Day 1: Big-O, Big-Theta, Big-Omega & Amortized Complexity",
      summary: "Understand rigorous asymptotic notations, space-time trade-offs, master theorem for divide-and-conquer, and amortized array expansion.",
      deepExplanation: "Asymptotic analysis measures algorithm scalability as input size N approaches infinity. Big-O (O) defines the mathematical upper bound (worst-case), Big-Omega (Ω) defines the lower bound (best-case), and Big-Theta (Θ) defines the tight bound where O and Ω converge. The Master Theorem `T(N) = aT(N/b) + f(N)` provides closed-form analysis for divide-and-conquer algorithms like Merge Sort (O(N log N)) and Binary Search (O(log N)). Amortized analysis proves that while a single dynamic array expansion costs O(N), N expansions cost O(N) in total, yielding O(1) amortized cost per operation.",
      eli10: {
        title: "The Speed Limits of the Highway",
        story: "Big-O is like the maximum speed limit on a highway (the worst traffic condition you can ever expect). Big-Omega is the minimum speed. When both numbers match, you know the exact travel time regardless of weather!",
        keyConcepts: [
          { term: "Big-O (O)", meaning: "Upper asymptotic bound representing the worst-case growth rate of time or memory." },
          { term: "Space Complexity", meaning: "Total memory consumed by an algorithm, including auxiliary data structures and stack frames." },
          { term: "Master Theorem", meaning: "Mathematical formula for determining Big-O of recursive divide-and-conquer recurrences." }
        ]
      },
      codeSnippet: `// Comparing O(N) Linear vs O(log N) Binary Search
function binarySearch(sortedArr, target) {
  let left = 0;
  let right = sortedArr.length - 1;
  let comparisons = 0;

  while (left <= right) {
    comparisons++;
    const mid = Math.floor((left + right) / 2);
    if (sortedArr[mid] === target) {
      return { index: mid, comparisons };
    } else if (sortedArr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return { index: -1, comparisons };
}

const arr = Array.from({ length: 1000 }, (_, i) => i * 2);
console.log("Search Result:", binarySearch(arr, 998)); // Only ~10 comparisons for 1,000 items!`,
      expectedOutput: `Search Result: { index: 499, comparisons: 10 }`,
      pitfalls: "Assuming an algorithm with fewer lines of code is faster. A nested loop of 3 lines can be O(N^3) and freeze servers on N=10,000.",
      practiceChallenge: {
        question: "Implement an O(N) two-pointer algorithm to find two numbers in a sorted array that sum up to a given target.",
        solutionCode: `function twoSumSorted(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}

console.log("Indices:", twoSumSorted([2, 7, 11, 15], 9)); // [0, 1]`
      },
      quiz: {
        question: "What is the time complexity of searching for an element in an unsorted array versus a sorted array of size N using binary search?",
        options: [
          "Both are O(log N)",
          "Unsorted is O(1); Sorted is O(N)",
          "Unsorted is O(N); Sorted with Binary Search is O(log N)",
          "Both are O(N^2)"
        ],
        correctIndex: 2,
        hint: "Looking through a messy pile requires checking each one (N items). Opening a sorted phonebook in the exact middle cuts the work in half every time (log N).",
        explanation: "An unsorted array requires checking every element sequentially (O(N)), while a sorted array allows binary search to halve the search space at each step (O(log N))."
      },
      youtubeLectures: [
        {
          title: "Introduction to Algorithms: Asymptotic Complexity (MIT 6.006)",
          channel: "MIT OpenCourseWare",
          duration: "48 mins",
          url: "https://www.youtube.com/watch?v=ZA-tUyM_y7s",
          videoId: "ZA-tUyM_y7s",
          summary: "Prof. Erik Demaine's masterclass on Big-O notations, model of computation, and peak finding algorithms.",
          timestampGuide: [
            { time: "00:00", label: "Why Algorithms Matter" },
            { time: "12:30", label: "Peak Finder Problem & Asymptotics" },
            { time: "28:00", label: "Formal Definitions of Big-O, Theta, Omega" }
          ]
        }
      ],
      externalResources: [
        {
          title: "Stanford CS166: Mathematical Asymptotics Handout",
          url: "https://web.stanford.edu/class/cs166/",
          provider: "Stanford CS Department",
          type: "Course Handout",
          desc: "Rigorous proofs of algorithmic bounds, recurrence relations, and amortized data structure analysis."
        }
      ],
      webLink: {
        title: "MIT OCW 6.006 Algorithms & Asymptotics Syllabus",
        url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
      }
    }
  ],
  java: [
    {
      id: "java-1",
      dayNumber: 1,
      subject: "Java Enterprise",
      topicCategory: "JVM Memory & ClassLoading",
      title: "Day 1: JVM Architecture, ClassLoader & Memory Model (JMM)",
      summary: "Explore the Java Virtual Machine: Bootstrap/Extension/Application ClassLoaders, JVM Stack Frames, Metaspace, Heap (Eden, Survivor, Tenured), and JIT compilation.",
      deepExplanation: "When Java bytecode executes on the HotSpot JVM, the ClassLoader subsystem loads, links, and initializes `.class` binaries. In memory, the JVM organizes runtime data into thread-private areas (Program Counter Register, JVM Stack, Native Method Stack) and shared areas (Heap, Metaspace). The Heap is partitioned into Young Generation (Eden, S0, S1) and Old Generation (Tenured). The JIT (Just-In-Time) compiler monitors hot method execution counters and compiles bytecode directly into native machine instructions via C1 (client) and C2 (server) compilers with speculative optimizations and escape analysis.",
      eli10: {
        title: "The Factory Floor & The Waste Sorting Facility",
        story: "Think of the JVM as a massive manufacturing plant. The ClassLoader is the loading dock inspecting incoming blueprints. The Stack is each worker's personal desk (temporary scratch work), and the Heap is the communal warehouse where finished goods are stored and sorted by the Garbage Collector!",
        keyConcepts: [
          { term: "Metaspace", meaning: "Native memory region replacing PermGen for class metadata, dynamically resizing with OS memory." },
          { term: "JIT Compilation", meaning: "Compiling frequently executed bytecode into raw assembly code during runtime for near C++ performance." },
          { term: "Escape Analysis", meaning: "Compiler optimization that allocates objects on the thread stack instead of the heap if they don't escape method scope." }
        ]
      },
      codeSnippet: `// Demonstrating Reference Types and Memory Usage
public class MemoryInspection {
    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = (totalMemory - freeMemory) / (1024 * 1024);

        System.out.println("=== JVM Runtime Memory Diagnostics ===");
        System.out.println("Available Processors: " + runtime.availableProcessors());
        System.out.println("Heap Memory Allocated: " + (totalMemory / (1024 * 1024)) + " MB");
        System.out.println("Heap Memory Used: " + usedMemory + " MB");
    }
}`,
      expectedOutput: `=== JVM Runtime Memory Diagnostics ===
Available Processors: 8
Heap Memory Allocated: 256 MB
Heap Memory Used: 4 MB`,
      pitfalls: "Creating unbounded static collections (e.g. `static Map cache`) without an eviction policy, preventing the Garbage Collector from freeing unreferenced objects and triggering `java.lang.OutOfMemoryError: Java heap space`.",
      practiceChallenge: {
        question: "Write a thread-safe Singleton class in Java using Double-Checked Locking with the `volatile` keyword.",
        solutionCode: `public class DatabaseConnectionPool {
    private static volatile DatabaseConnectionPool instance;

    private DatabaseConnectionPool() {}

    public static DatabaseConnectionPool getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnectionPool.class) {
                if (instance == null) {
                    instance = new DatabaseConnectionPool();
                }
            }
        }
        return instance;
    }
}`
      },
      quiz: {
        question: "Why is the `volatile` keyword required in the Double-Checked Locking Singleton pattern in Java?",
        options: [
          "It allocates the singleton object in Metaspace instead of Heap",
          "It turns the class into an asynchronous virtual thread",
          "It prevents CPU instruction reordering during object initialization, ensuring half-initialized instances are never exposed",
          "It encrypts the object state in memory"
        ],
        correctIndex: 2,
        hint: "Computers like to reorder steps to be faster. 'volatile' puts up a strict fence so nobody sees a house before the foundation and roof are actually built.",
        explanation: "Without 'volatile', the Java Memory Model allows compiler/CPU instruction reordering where memory is allocated and assigned to 'instance' before the constructor finishes executing, causing other threads to read a broken partial object."
      },
      youtubeLectures: [
        {
          title: "JVM Architecture & Memory Management Explained",
          channel: "Defog Tech",
          duration: "20 mins",
          url: "https://www.youtube.com/watch?v=ZBJ0u9MaKtM",
          videoId: "ZBJ0u9MaKtM",
          summary: "Crystal-clear visual walkthrough of Heap, Stack, Metaspace, ClassLoaders, and Garbage Collection cycles in Java.",
          timestampGuide: [
            { time: "00:00", label: "Overview of JVM Subsystems" },
            { time: "06:10", label: "Stack vs Heap Allocation" },
            { time: "14:30", label: "Generational Garbage Collection" }
          ]
        }
      ],
      externalResources: [
        {
          title: "Oracle Java SE 21 JVM Specification",
          url: "https://docs.oracle.com/javase/specs/jvms/se21/html/index.html",
          provider: "Oracle",
          type: "Official Specification",
          desc: "The authoritative specification for class file format, bytecode instructions, and memory layout."
        }
      ],
      webLink: {
        title: "Java SE 21 Language & VM Specs (Oracle Documentation)",
        url: "https://docs.oracle.com/en/java/javase/21/"
      }
    }
  ],
  devops: [
    {
      id: "devops-1",
      dayNumber: 1,
      subject: "Cloud Native & DevOps",
      topicCategory: "Containers & Linux Namespaces",
      title: "Day 1: Linux Namespaces, Cgroups & Container Runtime Architecture",
      summary: "Understand how Docker and OCI container runtimes isolate processes using Linux Kernel Namespaces (PID, MNT, NET, IPC, UTS, USER) and Control Groups (cgroups v2).",
      deepExplanation: "Containers are not lightweight virtual machines; there is no hypervisor or guest operating system kernel. A container is simply a standard Linux process running with kernel constraints. Linux Namespaces isolate what a process can *see* (PID namespace isolates process tree, NET namespace isolates network devices and routing tables, MNT namespace isolates root filesystem pivots with `pivot_root`). Control Groups (cgroups v2) limit and monitor what a process can *use* (CPU cycles, memory ceiling, block I/O bandwidth). Container engines (Docker, containerd, runc) construct these kernel configurations automatically from OCI specifications.",
      eli10: {
        title: "The Soundproof Apartment with Metered Electricity",
        story: "A Virtual Machine is like building an entire standalone house from scratch just to do laundry. A Container is like an apartment inside a big apartment building (the Linux Kernel): you share the building's water and power pipes, but you have your own locked front door (Namespaces) and your own electrical circuit breaker that cuts off if you use too much power (Cgroups)!",
        keyConcepts: [
          { term: "Namespaces", meaning: "Linux kernel feature that provides isolated virtual views of system resources (PID, Network, Mount)." },
          { term: "Control Groups (cgroups)", meaning: "Kernel subsystem that meters, limits, and throttles resource utilization (CPU, RAM, Disk I/O)." },
          { term: "OCI (Open Container Initiative)", meaning: "The industry standard specification for container image format and runtime execution (runc)." }
        ]
      },
      codeSnippet: `# Multi-Stage Production Dockerfile with Least Privilege
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Run as non-root user for enterprise container security
USER node
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
      expectedOutput: `# Production Container Benefits:
1. Final image size reduced from ~900MB to ~120MB.
2. Hardened security: Runs as non-root user 'node'.`,
      pitfalls: "Running container processes as the default `root` user in production and including build tools/compilers in the final production runtime image.",
      practiceChallenge: {
        question: "Write a `docker-compose.yml` defining an Express web service with 512MB memory limit and a PostgreSQL database with health checks.",
        solutionCode: `version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: app
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d app"]
      interval: 5s
      timeout: 5s
      retries: 5`
      },
      quiz: {
        question: "What is the primary difference between Linux Namespaces and Control Groups (cgroups) in container isolation?",
        options: [
          "Namespaces run in user space; Cgroups run in hypervisors",
          "Namespaces isolate what a process can see (process IDs, network); Cgroups limit how much resource a process can consume (CPU, RAM)",
          "Namespaces are only used for storage; Cgroups are only used for GPUs",
          "There is no difference between them"
        ],
        correctIndex: 1,
        hint: "Namespaces are blindfolds (what you can see), while cgroups are strict fences on your plate (how much CPU/RAM food you can eat).",
        explanation: "Namespaces provide visibility boundaries (creating the illusion of an isolated operating system), while cgroups enforce resource allocation boundaries (preventing one process from starving the host of CPU or RAM)."
      },
      youtubeLectures: [
        {
          title: "How Containers Work: Namespaces, Cgroups & Linux Internals",
          channel: "Fireship",
          duration: "12 mins",
          url: "https://www.youtube.com/watch?v=gT5-hWwXfPU",
          videoId: "gT5-hWwXfPU",
          summary: "Fast-paced visual breakdown of how Docker leverages clone() syscalls, chroot, and cgroups under the hood.",
          timestampGuide: [
            { time: "00:00", label: "VMs vs Containers" },
            { time: "04:10", label: "Building a Container with raw Linux CLI" },
            { time: "09:00", label: "Cgroups Resource Throttling" }
          ]
        }
      ],
      externalResources: [
        {
          title: "Docker Engine Architecture Specification",
          url: "https://docs.docker.com/engine/",
          provider: "Docker Docs",
          type: "Official Architecture Guide",
          desc: "Under the hood walkthrough of containerd, runc, layered storage drivers (overlay2), and rootless mode."
        }
      ],
      webLink: {
        title: "Kubernetes Core Concepts & Container Standards (kubernetes.io)",
        url: "https://kubernetes.io/docs/concepts/overview/"
      }
    }
  ]
};
